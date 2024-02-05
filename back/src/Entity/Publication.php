<?php

namespace App\Entity;

use Gedmo\Mapping\Annotation as Gedmo;
use App\Repository\PublicationRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PublicationRepository::class)]
class Publication
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'publications')]
    private ?User $userId = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $topic = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $writingTechnique = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $openAiResponse = null;

    #[Gedmo\Timestampable(on: 'create')]
    #[ORM\Column (type: Types::DATETIME_IMMUTABLE)]
    private ?\DateTimeImmutable $createdAt = null;

    #[Gedmo\Timestampable]
    #[ORM\Column(nullable: true, type: Types::DATETIME_IMMUTABLE)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\Column(length: 255)]
    private ?string $platform = null;

    #[ORM\Column(length: 100, nullable: true)]
    private ?string $mode = null;

    #[ORM\Column(nullable: true)]
    private ?int $tokenPrompt = null;

    #[ORM\Column(nullable: true)]
    private ?int $tokenCompletion = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $targetAudience = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUserId(): ?User
    {
        return $this->userId;
    }

    public function setUserId(?User $userId): static
    {
        $this->userId = $userId;

        return $this;
    }

    public function getTopic(): ?string
    {
        return $this->topic;
    }

    public function setTopic(string $topic): static
    {
        $this->topic = $topic;

        return $this;
    }

    public function getWritingTechnique(): ?string
    {
        return $this->writingTechnique;
    }

    public function setWritingTechnique(?string $writingTechnique): static
    {
        $this->writingTechnique = $writingTechnique;

        return $this;
    }

    public function getOpenAiResponse(): ?string
    {
        return $this->openAiResponse;
    }

    public function setOpenAiResponse(string $openAiResponse): static
    {
        $this->openAiResponse = $openAiResponse;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->getId(),
            'topic' => $this->getTopic(),
            'writingTechnique' => $this->getWritingTechnique(),
            'mode' => $this->getMode(),
            'openAiResponse' => $this->getOpenAiResponse(),
            'platform' => $this->getPlatform(),
            'createdAt' => $this->getCreatedAt(),
            'updatedAt' => $this->getUpdatedAt(),
        ];
    }

    public function getPlatform(): ?string
    {
        return $this->platform;
    }

    public function setPlatform(string $platform): static
    {
        $this->platform = $platform;

        return $this;
    }

    public function getMode(): ?string
    {
        return $this->mode;
    }

    public function setMode(?string $mode): static
    {
        $this->mode = $mode;

        return $this;
    }

    public function getTokenPrompt(): ?int
    {
        return $this->tokenPrompt;
    }

    public function setTokenPrompt(?int $tokenPrompt): static
    {
        $this->tokenPrompt = $tokenPrompt;

        return $this;
    }

    public function getTokenCompletion(): ?int
    {
        return $this->tokenCompletion;
    }

    public function setTokenCompletion(?int $tokenCompletion): static
    {
        $this->tokenCompletion = $tokenCompletion;

        return $this;
    }

    public function getTargetAudience(): ?string
    {
        return $this->targetAudience;
    }

    public function setTargetAudience(?string $targetAudience): static
    {
        $this->targetAudience = $targetAudience;

        return $this;
    }

    
}
