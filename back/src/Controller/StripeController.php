<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\ApiResponder;
use Doctrine\ORM\EntityManagerInterface;
use App\Service\CheckoutSessionService;
use App\Service\CustomerPortalSessionService;
use App\Service\StripeWebhookService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Stripe\Stripe;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class StripeController extends AbstractController
{
    private $entityManager;
    private $customerPortalSessionService;
    private $checkoutSessionService;

    public function __construct(
        private $stripeApiKey, 
        CustomerPortalSessionService $customerPortalSessionService,
        CheckoutSessionService $checkoutSessionService,
        EntityManagerInterface $entityManager
        )
    {
        if ($this->stripeApiKey === null) {
            throw new \Exception('Stripe API key not defined');
        }
        $this->entityManager = $entityManager;
        $this->customerPortalSessionService = $customerPortalSessionService;
        $this->checkoutSessionService = $checkoutSessionService;
    }

    #[Route('/manager/create-checkout-session/{planId}', name: 'create_checkout_session', methods: ['GET'])]
    #[Route('/create-checkout-session/{planId}', name: 'create_checkout_session_ok', methods: ['GET'])]
    public function createCheckoutSession(UrlGeneratorInterface $urlGenerator, string $planId, Request $request): Response
    {
        $session = $request->getSession();
        $userId = $session->get('userId');
        if ($userId === null) {
            throw new \Exception('User ID not found in session');
        }
        $user = $this->entityManager->getRepository(User::class)->find($userId);
        $userEmail = $user->getEmail();
        $userStripeCustomerId = $user->getStripeId();
        $checkoutSessionUrl = $this->checkoutSessionService->create($urlGenerator, $planId, $userEmail, $userStripeCustomerId);
        return $this->redirect($checkoutSessionUrl);
    }

    #[Route('/create-customer-portal-session', name: 'create_customer_portal_session', methods: ['POST'])]
    public function createCustomerPortalSession(UrlGeneratorInterface $urlGenerator, Request $request): Response
    {
        $session = $request->getSession();
        $userId = $session->get('userId');
        if ($userId === null) {
            throw new \Exception('User ID not found in session');
        }
        $user = $this->entityManager->getRepository(User::class)->find($userId);
        $userStripeCustomerId = $user->getStripeId();
        $checkoutSessionUrl = $this->customerPortalSessionService->create($urlGenerator, $userStripeCustomerId);
        return $this->redirect($checkoutSessionUrl);
    }

    #[Route('/stripe-webhook', name: 'stripe_webhook', methods: ['POST'])]
    public function handleStripeWebhook(Request $request, StripeWebhookService $stripeWebhookService, string $endpointSecret): Response
    {
        $payload = $request->getContent();
        $sigHeader = $request->headers->get('stripe-signature');
    
        return $stripeWebhookService->handleWebhook($payload, $sigHeader, $endpointSecret);
    }

    #[Route('/api/stripe', name: 'stripe', methods: ['GET'])]
    public function stripeLinkDashboard(ApiResponder $apiResponder, string $stripeLinkDashboard): Response
    {
        return $apiResponder->createResponse(true, ['link' => $stripeLinkDashboard]);
    }
}
