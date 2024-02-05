<?php


namespace App\Service;


use Symfony\Component\HttpKernel\Exception\HttpException;
use Stripe\Stripe;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class CustomerPortalSessionService {
    public function __construct(private $stripeApiKey) {
        if ($this->stripeApiKey === null) {
            throw new \Exception('Stripe API key not defined');
        }
    }

    public function create(UrlGeneratorInterface $urlGenerator,$customerId) {
        if ($customerId === null) {
            throw new \Exception('Customer ID is null');
        }
        \Stripe\Stripe::setApiKey($this->stripeApiKey);
        try {
            $checkout_session = \Stripe\BillingPortal\Session::create([
                'customer' => $customerId,
                'return_url' => $urlGenerator->generate('plans', [], UrlGeneratorInterface::ABSOLUTE_URL),
            ]);

            return $checkout_session->url;
        } catch (\Exception $e) {
            throw new HttpException(500, 'Erreur lors de la création de la session de paiement Stripe' . $e->getMessage(), $e);
        }
    }
}