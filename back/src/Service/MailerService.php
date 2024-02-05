<?php

namespace App\Service;

use App\Entity\User;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Part\DataPart;

class MailerService
{
    private string $imagePath;

    public function __construct(private MailerInterface $mailer, private string $backUrl, KernelInterface $kernel)
    {
        $relativePath = 'manager/build/images/';
        $projectDir = $kernel->getProjectDir();
        $this->imagePath = $projectDir . '/public/' . $relativePath;
    }

    public function sendRegisterMail(User $user): void
    {
        $email = (new TemplatedEmail())
            ->from('support@reseaux-revolution.co')
            ->to($user->getEmail())
            ->subject('Confirmation de votre adresse mail')
            ->htmlTemplate('emails/register.html')
            ->context([
                'backUrl' => $this->backUrl,
                'token' => $user->getTokenVerication()
            ]);

        $image = DataPart::fromPath($this->imagePath.'logo.png', 'logo');
        $email->addPart($image);

        $this->mailer->send($email);
    }

    public function sendPaymentMail(User $user): void
    {
        $email = (new TemplatedEmail())
            ->from('support@reseaux-revolution.co')
            ->to($user->getEmail())
            ->subject('Modification du moyen de paiement')
            ->htmlTemplate('emails/payment.html')
            ->context([
                'backUrl' => $this->backUrl,
                'userId' => $user->getId()
            ]);

        $image = DataPart::fromPath($this->imagePath.'logo.png', 'logo');
        $email->addPart($image);

        $this->mailer->send($email);
    }

    public function sendForgetPasswordMail(User $user, string $token): void
    {
        $email = (new TemplatedEmail())
            ->from('support@reseaux-revolution.co')
            ->to($user->getEmail())
            ->subject('Demande de changement de mot de passe')
            ->htmlTemplate('emails/forget-password.html')
            ->context([
                'backUrl' => $this->backUrl,
                'token' => $token
            ]);

        $image = DataPart::fromPath($this->imagePath.'logo.png', 'logo');
        $email->addPart($image);

        $this->mailer->send($email);
    }

    public function sendPasswordChanged(User $user): void
    {
        $email = (new TemplatedEmail())
            ->from('support@reseaux-revolution.co')
            ->to($user->getEmail())
            ->subject('Votre mot de passe a été modifié')
            ->htmlTemplate('emails/password-changed.html');

        $image = DataPart::fromPath($this->imagePath.'logo.png', 'logo');
        $email->addPart($image);

        $this->mailer->send($email);
    }

    public function sendPaymentMailAfterTest(User $user): void
    {
        $email = (new TemplatedEmail())
            ->from('support@reseaux-revolution.co')
            ->to($user->getEmail())
            ->subject('Période d\'essai terminée')
            ->htmlTemplate('emails/payment-after-test.html')
            ->context([
                'backUrl' => $this->backUrl,
                'userId' => $user->getId()
            ]);

        $image = DataPart::fromPath($this->imagePath.'logo.png', 'logo');
        $email->addPart($image);

        $this->mailer->send($email);
    }
}