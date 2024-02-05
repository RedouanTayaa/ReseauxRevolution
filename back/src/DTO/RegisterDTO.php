<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class RegisterDTO
{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Type('string')]
        #[Assert\Length(min: 1, max: 255)]
        public readonly string $email,

        #[Assert\NotBlank]
        #[Assert\Type('string')]
        #[Assert\Length(min: 8, max: 50, exactMessage: 'Le mot de passe doit contenir entre 8 et 50 caractères')]
        public readonly string $password
    ) {
    }
}