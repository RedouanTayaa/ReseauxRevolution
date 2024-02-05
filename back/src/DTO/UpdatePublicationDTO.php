<?php


namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class UpdatePublicationDTO {
    #[Assert\Type('string')]
    #[Assert\Length(max: 5000)]
//    #[Assert\Regex(
//        pattern: "/^[\p{L}\p{N}\p{P}\p{Z}\p{S}]*$/u",
//        message: "La réponse ne peut contenir que des lettres, des chiffres, des caractères spéciaux et des émojis"
//    )]
    #[Assert\Regex(
        pattern: "/<[^>]*>/",
        message: "La réponse ne peut pas contenir de balises HTML",
        match: false
    )]
    public ?string $openAiResponse;

    public function __construct(?string $openAiResponse = null) {
        $this->openAiResponse = $openAiResponse;
    }
}
