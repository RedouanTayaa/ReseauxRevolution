<?php

namespace App\Controller;

use App\DTO\UpdatePublicationDTO;
use App\DTO\PublicationDTO;
use App\Service\ApiResponder;
use App\Service\MailerService;
use Symfony\Component\ErrorHandler\Exception\FlattenException;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use App\Entity\Publication;
use Doctrine\ORM\EntityManagerInterface;
use App\Service\OpenAIService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\Routing\Annotation\Route;

class ApiController extends AbstractController
{
    private OpenAIService $openAIService;
    private EntityManagerInterface $entityManager;
    private ApiResponder $apiResponder;

    public function __construct(
        OpenAIService $openAIService,
        EntityManagerInterface $entityManager,
        ApiResponder $apiResponder
    )
    {
        $this->openAIService = $openAIService;
        $this->entityManager = $entityManager;
        $this->apiResponder = $apiResponder;
    }

    #[Route('/api/publications', name: 'api_completion', methods: ['POST'])]
    public function index(
        #[MapRequestPayload] PublicationDTO $publicationDTO,
        MailerService $mailerService
    ): JsonResponse {
        if (!$this->getUser()->isHasPaid()) {
            throw new HttpException(401, '');
        }
        try {
            // Gérer le choix entre publication et vente
            $data = $this->openAIService->postCompletion(
                $publicationDTO->topic, 
                $publicationDTO->choice, 
                $publicationDTO->platform, 
                $publicationDTO->mode, 
                $publicationDTO->writingTechnique,
                $publicationDTO->targetAudience
            );

            $user = $this->getUser();
            // Création d'une nouvelle entité Publication
            $publication = new Publication();
            $publication->setTopic($publicationDTO->topic);
            //$publication->setWritingTechnique(null);
            $publication->setMode($publicationDTO->mode);
            $publication->setTargetAudience($publicationDTO->targetAudience);
            $publication->setPlatform($publicationDTO->platform);
            $publication->setOpenAiResponse($data['choices'][0]['message']['content']);
            $publication->setTokenPrompt($data['usage']['prompt_tokens']);
            $publication->setTokenCompletion($data['usage']['completion_tokens']);
            $publication->setUserId($user);
    
            // Si c'est une vente, on définit la technique de rédaction
            if ($publicationDTO->choice === 'sales') {
                $publication->setWritingTechnique($publicationDTO->writingTechnique);
            }

            $user->addNbPublication();
            // Persistance de l'entité dans la base de données
            $this->entityManager->persist($user);
            $this->entityManager->persist($publication);
            $this->entityManager->flush();

            if ($user->getNbPublication() === 3) {
                $user->setHasPaid(false);
                $this->entityManager->flush();

                $mailerService->sendPaymentMailAfterTest($user);
            }
        } catch (\Exception $e) {
            throw new \Exception('Publication non générée suite à une erreur. Veuillez réessayer dans quelques minutes'. $e->getMessage(), 500);
        }
        
        return $this->apiResponder->createResponse(true, $publication->toArray(), 'Le post a été généré');
    }
    

    #[Route('/api/publications', name: 'api_publications', methods: ['GET'])]
    public function getPublications(): JsonResponse
    {
        if (!$this->getUser()->isHasPaid()) {
            throw new HttpException(401, '');
        }

        $publications = $this->entityManager->getRepository(Publication::class)->findBy(['userId' => $this->getUser()], ['createdAt' => 'DESC']);
        $publicationsArray = array_map(function ($publication) {
            return $publication->toArray();
        }, $publications);

        return $this->apiResponder->createResponse(true, $publicationsArray, '');
    }

    #[Route('/api/publications/{id}', name: 'api_publications_update', methods: ['PUT'])]
    public function updatePublication(
        #[MapRequestPayload] UpdatePublicationDTO $updatePublicationDTO, 
        int $id
        ): JsonResponse
    {
        $publication = $this->entityManager->getRepository(Publication::class)->find($id);

        if (!$publication) {
            throw new \Exception('Publication non trouvée', 404);
        }
        if ($publication->getUserId()->getId() !== $this->getUser()->getId()) {
            throw new \Exception('Publication non trouvée', 404);
        }

        if (isset($updatePublicationDTO->openAiResponse)) {
            $publication->setOpenAiResponse($updatePublicationDTO->openAiResponse);
            $this->entityManager->flush();
        }

        return $this->apiResponder->createResponse(true, $publication->toArray(), '');
    }

    #[Route('/api/publications/{id}', name: 'api_publications_delete', methods: ['DELETE'])]
    public function deletePublication(int $id): JsonResponse
    {
        $publication = $this->entityManager->getRepository(Publication::class)->find($id);

        if (!$publication) {
            throw new \Exception('Publication non trouvée', 404);
        }
        if ($publication->getUserId()->getId() !== $this->getUser()->getId()) {
            throw new \Exception('Publication non trouvée', 404);
        }

        $this->entityManager->remove($publication);
        $this->entityManager->flush();

        return $this->apiResponder->createResponse(true, null, 'Publication supprimée');
    }
}
