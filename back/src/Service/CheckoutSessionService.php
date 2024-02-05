<?php

namespace App\Service;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Stripe\Stripe;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class CheckoutSessionService {
    private $stripeApiKey;

    public function __construct($stripeApiKey) {
        if ($stripeApiKey === null) {
            throw new \Exception('Stripe API key not defined');
        }

        $this->stripeApiKey = $stripeApiKey;
    }

    public function create(UrlGeneratorInterface $urlGenerator, string $planId, string $userEmail, string $userStripeCustomerId) {
        \Stripe\Stripe::setApiKey($this->stripeApiKey);

        try {
            $checkout_session = \Stripe\Checkout\Session::create([
                'line_items' => [[
                    'price' => $planId,
                    'quantity' => 1,
                ]],
                'mode' => 'subscription',
                'success_url' => $urlGenerator->generate('payment_success', [], UrlGeneratorInterface::ABSOLUTE_URL) . '?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => $urlGenerator->generate('payment_cancelled', [], UrlGeneratorInterface::ABSOLUTE_URL),
                'customer' => $userStripeCustomerId,
            ]);

            return $checkout_session->url;
        } catch (\Exception $e) {
            throw new HttpException(500, 'Erreur lors de la création de la session de paiement Stripe'. $e->getMessage(), $e);
        }
    }
}