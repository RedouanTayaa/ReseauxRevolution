<?php

namespace App\Controller;

use App\Entity\Plan;
use Symfony\Component\HttpFoundation\Request;
use Stripe\Stripe;
use Stripe\Customer;
use App\DTO\RegisterDTO;
use App\Entity\User;
use App\Service\ApiResponder;
use App\Service\MailerService;
use App\Service\TokenService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class RegisterController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    private TokenService $tokenService;
    private ApiResponder $apiResponder;
    private $stripeApiKey;

    public function __construct(
        EntityManagerInterface $entityManager,
        TokenService $tokenService,
        ApiResponder $apiResponder,
        $stripeApiKey
    ) {
        if ($stripeApiKey === null) {
            throw new \Exception('Stripe API key not defined');
        }

        $this->stripeApiKey = $stripeApiKey;
        $this->entityManager = $entityManager;
        $this->tokenService = $tokenService;
        $this->apiResponder = $apiResponder;
    }

    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(
        #[MapRequestPayload] RegisterDTO $registerDTO,
        UserPasswordHasherInterface $passwordHasher,
        MailerService $mailer,
    ): JsonResponse {
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $registerDTO->email]);

        if ($user) {
            throw new \Exception('Un compte avec cette adresse mail existe déjà');
        }

        $user = new User();
        $user
            ->setEmail($registerDTO->email)
            ->setPassword($passwordHasher->hashPassword($user, $registerDTO->password))
            ->setHasPaid(false)
            ->setTokenVerication($this->tokenService->generate($user));
        $this->entityManager->persist($user);
        $this->entityManager->flush();
        // Créez un client Stripe pour l'utilisateur
        Stripe::setApiKey($this->stripeApiKey);
        $customer = Customer::create([
            'email' => $user->getEmail(),
        ]);

        // Stockez l'ID du client Stripe dans votre base de données
        $user->setStripeId($customer->id);

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        $mailer->sendRegisterMail($user);

        return $this->apiResponder->createResponse(true, $user, 'Compte créé');
    }

    #[Route('/register/{token}', name: 'api_register_token', methods: ['GET'])]
    public function registerVerification(
        string $token,
        string $frontUrl,
        Request $request
    ) {
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['tokenVerication' => $token]);


        if (!$user) {
            return $this->render('register/failed.html.twig', ['message' => 'Token non existant']);
        }

        if (!$this->tokenService->verify($token, $user)) {
            return $this->render('register/failed.html.twig', ['message' => 'Token non existant']);
        }
        $session = $request->getSession();
        $session->set('userId', $user->getId());

        $user->setIsEmailVerified(true);
        // A supprimer au bout de 100 clients
        $user->setHasPaid(true);
        $this->entityManager->flush();

        /** @var Plan $plan */
        $plan = $this->entityManager->getRepository(Plan::class)->findAll()[0];

        return $this->render('register/success.html.twig', ['planId' => $plan->getStripeId(), 'frontUrl' => $frontUrl]);
    }

    #[Route('/payment/{userId}', name: 'api_register_payment', methods: ['GET'])]
    public function PaymentAfterRegistration(
        $userId,
        Request $request
    ) {
        $user = $this->entityManager->getRepository(User::class)->find($userId);

        if (!$user || !$user->getIsEmailVerified()) {
            return $this->render('register/failed.html.twig', ['message' => 'Erreur ! Veuillez contacter le SAV']);
        }

        $session = $request->getSession();
        $session->set('userId', $user->getId());

        /** @var Plan $plan */
        $plan = $this->entityManager->getRepository(Plan::class)->findAll()[0];

        return $this->redirectToRoute('create_checkout_session', ['planId' => $plan->getStripeId()]);
    }
}
