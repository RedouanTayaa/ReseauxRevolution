<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Stripe\Stripe;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\PlanRepository;

class PlanController extends AbstractController
{
    private $planRepository;

    public function __construct(PlanRepository $planRepository)
    {
        $this->planRepository = $planRepository;
    }

    #[Route('/plans', name: 'plans')]
    public function index(): Response
    {
        $plans = $this->planRepository->findAll();

        return $this->render('plans/index.html.twig', [
            'plans' => $plans,
        ]);
    }

    #[Route('/manager/payment-success', name: 'payment_success')]
    #[Route('/payment-success', name: 'payment_success_ok')]
    public function paymentSuccess(string $frontUrl): Response
    {
        return $this->render('plans/payment_success.html.twig', ['frontUrl' => $frontUrl]);
    }

    #[Route('/manager/payment-cancelled', name: 'payment_cancelled')]
    #[Route('/payment-cancelled', name: 'payment_cancelled_ok')]
    public function paymentCancelled(): Response
    {
        return $this->render('plans/payment_cancelled.html.twig');
    }
}
