<?php

namespace App\Security;

use App\Entity\User;
use App\Service\MailerService;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAccountStatusException;
use Symfony\Component\Security\Core\User\UserCheckerInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class UserChecker implements UserCheckerInterface
{
    private MailerService $mailerService;
    public function __construct(MailerService $mailerService)
    {
        $this->mailerService = $mailerService;
    }

    public function checkPreAuth(UserInterface $user): void
    {
        if (!$user instanceof User) {
            return;
        }

        if (!$user->getIsEmailVerified()) {
            throw new CustomUserMessageAccountStatusException('Votre compte n\'a pas été validé. Veuillez vérifier votre boite email.');
        }

        if (!$user->isHasPaid()) {
            $this->mailerService->sendPaymentMail($user);
            throw new CustomUserMessageAccountStatusException('Vos informations de paiement sont incorrect. Veuillez vérifier votre boite email pour les corriger.');
        }
    }

    public function checkPostAuth(UserInterface $user): void
    {
    }
}