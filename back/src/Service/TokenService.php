<?php

namespace App\Service;

use App\Entity\User;
use DateTimeImmutable;

class TokenService
{
    const ERREUR_TOKEN = 'Token non existant';
    const ERREUR_TIME = 'Le délai pour modifier le mot de passe est dépassé. Veuillez refaire une demande.';
    const OK = 'OK';
    public function __construct(private readonly string $secretKeyToken)
    {
    }

    public function generate(User $user): string
    {
        return base64_encode($user->getEmail() . '/' . $this->secretKeyToken);
    }

    public function generatePassword(User $user): string
    {
        return base64_encode($user->getEmail() . '/' . $this->secretKeyToken . '/' . (new \DateTime())->format('Y-m-d H:i'));
    }

    public function verify(string $token, User $user): bool
    {
        $decode = explode('/', base64_decode($token));

        return count($decode) === 2 &&
            $decode[0] === $user->getEmail() &&
            $decode[1] === $this->secretKeyToken;
    }

    public function verifyPasswordToken(string $token): array
    {
        $decode = explode('/', base64_decode($token));

        if (
            count($decode) !== 3 ||
            $decode[1] !== $this->secretKeyToken
        ) {
            return [self::ERREUR_TOKEN, null];
        }

        $dateToken = DateTimeImmutable::createFromFormat('Y-m-d H:i', $decode[2]);
        $dateToken = $dateToken->add(new \DateInterval('P1D'));

        if (new \DateTime() > $dateToken) {
            return [self::ERREUR_TIME, null];
        }

        return [self::OK, $decode[0]];
    }
}