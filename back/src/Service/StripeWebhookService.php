<?php

namespace App\Service;

use Psr\Log\LoggerInterface;
use App\Entity\Plan;
use App\Entity\Subscription;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

class StripeWebhookService
{
    private $stripeApiKey;
    private $entityManager;
    private $logger;

    public function __construct($stripeApiKey, EntityManagerInterface $entityManager, LoggerInterface $logger)
    {
        if ($stripeApiKey === null) {
            throw new \Exception('Stripe API key not defined');
        }

        $this->logger = $logger;
        $this->stripeApiKey = $stripeApiKey;
        $this->entityManager = $entityManager;
    }

    public function handleWebhook($payload, $sigHeader, $endpointSecret)
    {
        \Stripe\Stripe::setApiKey($this->stripeApiKey);
        try {
            $event = \Stripe\Webhook::constructEvent($payload, $sigHeader, $endpointSecret);
        } catch (\UnexpectedValueException $e) {
            return new JsonResponse(['error' => 'Webhook error while parsing basic request.'], 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            return new JsonResponse(['error' => 'Webhook error. Invalid signature.'], 400);
        }

        switch ($event->type) {
                // L'événement `customer.subscription.deleted` est un type d'événement envoyé par Stripe via les webhooks. Il est déclenché lorsque la souscription d'un client est supprimée.            
            case 'customer.subscription.deleted':
                $subscriptionDeleted = $event->data->object;

                $user = $this->entityManager->getRepository(User::class)->findOneBy(['stripeId' => $subscriptionDeleted->customer]);
                if (!$user) {
                    $this->logger->error('Utilisateur avec Stripe ID ' . $subscriptionDeleted->customer . ' non trouvé.');
                    break;
                }

                $user->setHasPaid(false);
                $this->entityManager->persist($user);

                // Assure-toi que tu récupères la bonne souscription si l'utilisateur en a plusieurs
                $subscription = $this->entityManager->getRepository(Subscription::class)->findOneBy(['stripeId' => $subscriptionDeleted->id]);
                if ($subscription) {
                    $subscription->setIsActive(false);
                    $subscription->setCurrentPeriodEnd(new \DateTimeImmutable('@' . $subscriptionDeleted->current_period_end));
                    $this->entityManager->persist($subscription);
                } else {
                    $this->logger->error('Souscription avec Stripe ID ' . $subscriptionDeleted->id . ' non trouvée.');
                }

                $this->entityManager->flush();
                // Envoi d'un email pour informer de la suppression de l'abonnement (si nécessaire)
                break;
                // L'événement `customer.subscription.updated` est un type d'événement envoyé par Stripe via les webhooks. Il est déclenché lorsque la souscription d'un client est mise à jour.
            case 'customer.subscription.updated':
                $subscriptionUpdated = $event->data->object;

                // Trouver l'entité Subscription basée sur l'ID Stripe de l'abonnement
                $subscription = $this->entityManager->getRepository(Subscription::class)->findOneBy(['stripeId' => $subscriptionUpdated->id]);

                // Trouver l'entité User basée sur l'ID Stripe du client
                $user = $this->entityManager->getRepository(User::class)->findOneBy(['stripeId' => $subscriptionUpdated->customer]);

                if (!$subscription) {
                    $this->logger->error('Souscription avec Stripe ID ' . $subscriptionUpdated->id . ' non trouvée.');
                    break;
                }

                if (!$user) {
                    $this->logger->error('Utilisateur avec Stripe Customer ID ' . $subscriptionUpdated->customer . ' non trouvé.');
                    break;
                }

                // Vérifier le statut de l'abonnement et le champ cancel_at_period_end
                if ($subscriptionUpdated->status === 'active') {
                    $user->setHasPaid(true);
                    $subscription->setIsActive(true);
                } elseif ($subscriptionUpdated->status === 'canceled' && $subscriptionUpdated->cancel_at_period_end) {
                    // L'abonnement est annulé mais reste actif jusqu'à la fin de la période
                    $user->setHasPaid(true); // L'utilisateur a payé pour la période courante
                    $subscription->setIsActive(true); // L'abonnement reste actif
                } else {
                    // Pour tous les autres cas, comme un abonnement immédiatement annulé
                    $user->setHasPaid(false);
                    $subscription->setIsActive(false);
                }

                $subscription->setCurrentPeriodStart(new \DateTimeImmutable('@' . $subscriptionUpdated->current_period_start));
                $subscription->setCurrentPeriodEnd(new \DateTimeImmutable('@' . $subscriptionUpdated->current_period_end));

                // Sauvegarder les modifications
                $this->entityManager->persist($subscription);
                $this->entityManager->persist($user);
                $this->entityManager->flush();

                break;
                // L'événement `customer.subscription.created` est un type d'événement envoyé par Stripe via les webhooks. Il est déclenché lorsque la souscription d'un client est créée mais cela ne veut pas dire nécessairement que le paiment est éffectuer.
            case 'customer.subscription.created':
                $subscriptionCreated = $event->data->object;
                $user = $this->entityManager->getRepository(User::class)->findOneBy(['stripeId' => $subscriptionCreated->customer]);

                if (!$user) {
                    // Log l'erreur ou envoie une notification
                    $this->logger->error('Utilisateur avec Stripe ID ' . $subscriptionCreated->customer . ' non trouvé.');
                    break; // Sort du switch si l'utilisateur n'est pas trouvé
                }

                $plan = $this->entityManager->getRepository(Plan::class)->findOneBy(['stripeId' => $subscriptionCreated->items->data[0]->price->id]);

                if (!$plan) {
                    // Log l'erreur
                    $this->logger->error('Plan avec Stripe ID ' . $subscriptionCreated->items->data[0]->price->id . ' non trouvé.');

                    break; // Sort du switch si le plan n'est pas trouvé
                }

                // Création de la nouvelle entité Subscription
                $subscriptionEntity = new Subscription();
                $subscriptionEntity->setMember($user);
                $subscriptionEntity->setStripeId($subscriptionCreated->id);
                $subscriptionEntity->setCurrentPeriodStart(new \DateTimeImmutable('@' . $subscriptionCreated->current_period_start));
                $subscriptionEntity->setCurrentPeriodEnd(new \DateTimeImmutable('@' . $subscriptionCreated->current_period_end));
                $subscriptionEntity->setIsActive(true);
                $subscriptionEntity->setPlan($plan);
                $this->entityManager->persist($subscriptionEntity);
                $this->entityManager->flush();

                break;
            case 'invoice.payment_failed':
                $invoiceFailed = $event->data->object;

                // Trouver l'utilisateur associé à la facture
                $user = $this->entityManager->getRepository(User::class)->findOneBy(['stripeId' => $invoiceFailed->customer]);

                if ($user) {
                    // Mettre à jour le statut de paiement de l'utilisateur
                    $user->setHasPaid(false);

                    // Trouver la souscription associée à la facture
                    $subscription = $this->entityManager->getRepository(Subscription::class)->findOneBy(['stripeId' => $invoiceFailed->subscription]);

                    if ($subscription) {
                        // Mettre à jour le statut de l'abonnement
                        $subscription->setIsActive(false);
                        $this->entityManager->persist($subscription);
                    } else {
                        $this->logger->error('Souscription avec Stripe ID ' . $invoiceFailed->subscription . ' non trouvée.');
                    }

                    // Sauvegarder les changements
                    $this->entityManager->persist($user);
                    $this->entityManager->flush();

                    // Envoyer une notification à l'utilisateur ou prendre d'autres mesures
                    // ...

                } else {
                    $this->logger->error('Utilisateur avec Stripe Customer ID ' . $invoiceFailed->customer . ' non trouvé.');
                }

                break;
            case 'invoice.payment_succeeded':
                $invoiceSucceeded = $event->data->object;

                // Trouver l'utilisateur associé à la facture
                $user = $this->entityManager->getRepository(User::class)->findOneBy(['stripeId' => $invoiceSucceeded->customer]);

                if ($user) {
                    // Mettre à jour le statut de paiement de l'utilisateur
                    $user->setHasPaid(true);
                    $this->entityManager->persist($user);

                    // Si la facture est liée à un abonnement
                    if (!empty($invoiceSucceeded->subscription)) {
                        $subscription = $this->entityManager->getRepository(Subscription::class)->findOneBy(['stripeId' => $invoiceSucceeded->subscription]);

                        if ($subscription) {
                            // Mettre à jour le statut et les dates de l'abonnement
                            $subscription->setIsActive(true);
                            $subscription->setCurrentPeriodStart(new \DateTimeImmutable('@' . $invoiceSucceeded->lines->data[0]->period->start));
                            $subscription->setCurrentPeriodEnd(new \DateTimeImmutable('@' . $invoiceSucceeded->lines->data[0]->period->end));
                            $this->entityManager->persist($subscription);
                        } else {
                            $this->logger->error('Souscription avec Stripe ID ' . $invoiceSucceeded->subscription . ' non trouvée.');
                        }
                    }

                    // Sauvegarder les changements
                    $this->entityManager->flush();
                } else {
                    $this->logger->error('Utilisateur avec Stripe Customer ID ' . $invoiceSucceeded->customer . ' non trouvé.');
                }

                break;

            default:
                return new JsonResponse(['error' => 'Received unknown event type.'], 400);
        }

        return new JsonResponse(['status' => 'success'], 200);
    }
}
