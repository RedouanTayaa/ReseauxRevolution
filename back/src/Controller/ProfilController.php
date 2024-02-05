<?php

namespace App\Controller;

use App\DTO\ForgetPasswordDTO;
use App\Entity\User;
use App\Service\ApiResponder;
use App\Service\MailerService;
use App\Service\TokenService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Constraints as Assert;

class ProfilController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    private TokenService $tokenService;

    private ApiResponder $apiResponder;
    public function __construct(
        EntityManagerInterface $entityManager,
        TokenService $tokenService,
        ApiResponder $apiResponder
    )
    {
        $this->entityManager = $entityManager;
        $this->tokenService = $tokenService;
        $this->apiResponder = $apiResponder;
    }

    #[Route('/api/forgetpassword', name: 'api_forget_password', methods: ['POST'])]
    public function forgetPassword(
        #[MapRequestPayload] ForgetPasswordDTO $forgetPasswordDTO,
        MailerService $mailer
    ): JsonResponse
    {
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $forgetPasswordDTO->username]);

        if (!$user) {
            return $this->apiResponder->createResponse();
        }

        $token = $this->tokenService->generatePassword($user);
        $mailer->sendForgetPasswordMail($user, $token);

        return $this->apiResponder->createResponse();
    }

    #[Route('/manager/changepassword/{token}', name: 'api_change_password', methods: ['GET', 'POST'])]
    #[Route('/changepassword/{token}', name: 'api_change_password_ok', methods: ['GET', 'POST'])]
    public function changePassword(
        string $token,
        Request $request,
        MailerService $mailer,
        string $frontUrl,
        UserPasswordHasherInterface $passwordHasher,
    )
    {
        if ($request->isMethod('GET')) {
            [$error, $email] = $this->tokenService->verifyPasswordToken($token);

            if (is_null($email)) {
                return $this->render('profil/change-password-failed.html.twig', [
                    'message' => $error,
                ]);
            }

            $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $email]);

            if (!$user) {
                return $this->render('profil/change-password-failed.html.twig', [
                    'message' => TokenService::ERREUR_TOKEN,
                ]);
            }
        }

        $formPassword = $this->createFormBuilder()
            ->add('password', RepeatedType::class, [
                'type' => PasswordType::class,
                'first_options'  => [
                    'label' => 'Mot de passe',
                    'constraints' => [
                        new Assert\Length(['min' => 8,
                            'minMessage' => 'Le mot de passe doit contenir au moins 8 caractères',
                        ])
                    ]
                ],
                'second_options' => ['label' => 'Repétez le mot de passe'],
                'mapped' => false,
                'invalid_message'   => 'Les mots de passe ne correspondent pas',
            ])
            ->add('userId', HiddenType::class, ['data' => isset($user) ? $user->getId() : null])
            ->add('save', SubmitType::class, ['label' => 'Enregistrer'])
            ->getForm();

        $formPassword->handleRequest($request);

        if ($formPassword->isSubmitted() && $formPassword->isValid()) {
            $password = $formPassword->get('password')->getData();
            $userId = $formPassword->get('userId')->getData();

            $user = $this->entityManager->getRepository(User::class)->find($userId);
            $user->setPassword($passwordHasher->hashPassword($user, $password));
            $this->entityManager->persist($user);
            $this->entityManager->flush();

            $mailer->sendPasswordChanged($user);

            return $this->render('profil/change-password-success.html.twig', [
                'frontUrl' => $frontUrl,
            ]);
        }

        return $this->render('profil/change-password.html.twig', [
            'form' => $formPassword,
            'token' => $token
        ]);
    }
}