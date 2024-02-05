<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class PublicationDTO
{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Type('string')]
        #[Assert\Length(min: 1, max: 255)]
        #[Assert\Regex(
            pattern: "/^[a-zA-Z0-9 .,!?'\"-éèêëàâäôöùûüç]*$/",
            message: "Le sujet ne peut contenir que des lettres, des chiffres et des caractères spéciaux (. , ! ? ' \" -)"
        )]
        public readonly string $topic,

        #[Assert\NotBlank]
        #[Assert\Type('string')]
        #[Assert\Choice(choices: ['sales', 'publication',])]
        public readonly string $choice,

        #[Assert\Type('string')]
        #[Assert\Choice(
            choices: ['AIDA', 'PAS', 'FAB', 'QUEST', 'ACC', 'The 4 U\'s'],
            message: "La technique de rédaction n'est pas valide."
        )]
        public readonly ?string $writingTechnique,

        #[Assert\NotBlank]
        #[Assert\Type('string')]
        #[Assert\Choice(choices: ['Facebook', 'Twitter', 'LinkedIn', 'Instagram',])]
        public readonly string $platform,

        #[Assert\Type('string')]
        #[Assert\Choice(
            choices: ['Actualités Clés', 'Récits Communautaires', 'Débats Participatifs', 'Tendance & Actualité', 'Questions Ouvertes', 'Message Direct', 'Légendes Narratives', 'Inspiration Quotidienne', 'Interactions', 'Partage d\'Expertise', 'Réseau et Carrière', 'Contenu Éducatif'],
            message: "Le mode n'est pas valide."
        )]
        public readonly ?string $mode,

        #[Assert\NotBlank]
        #[Assert\Type('string')]
        #[Assert\Length(min: 1, max: 255)]
        #[Assert\Regex(
            pattern: "/^[a-zA-Z0-9 .,!?'\"-éèêëàâäôöùûüç]*$/",
            message: "Le public cible ne peut contenir que des lettres, des chiffres et des caractères spéciaux (. , ! ? ' \" -)"
        )]
        public readonly string $targetAudience,
        
    ) {
    }
}
