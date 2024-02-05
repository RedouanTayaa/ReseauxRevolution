<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class ForgetPasswordDTO
{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Type('string')]
        #[Assert\Length(min: 1, max: 255)]
        public readonly string $username,
    ) {
    }
}