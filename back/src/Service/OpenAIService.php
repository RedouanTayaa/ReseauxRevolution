<?php

namespace App\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;

class OpenAIService
{
    public function __construct(
        private readonly HttpClientInterface $client,
        private $openAIApiKey = null,
        private $openAIApiUrl = 'https://api.openai.com/v1/chat/completions',
        private $openAIModelName = 'gpt-4-1106-preview',
    ) {
        if ($this->openAIApiKey === null) {
            throw new \Exception('OpenAI API key not defined');
        }
    }

    public function postCompletion($topic, $choice, $platform, $mode = null, $writingTechnique = null, $targetAudience): array
    {

        if ($choice === 'sales') {
            $userPrompt = $this->generateSalesPrompt($topic, $platform, $writingTechnique);
        } else {
            $userPrompt = $this->generatePublicationPrompt($topic, $platform, $mode, $targetAudience);
        }

        $response = $this->client->request('POST', $this->openAIApiUrl, [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->openAIApiKey,
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'model' => $this->openAIModelName,
                'messages' => [
                    [
                        'role' => 'user',
                        'content' => $userPrompt
                    ]
                ]
            ],
        ]);
        if ($response->getStatusCode() !== 200) {
            throw new \Exception('OpenAI API request failed');
        }

        return $response->toArray();
        
    }

    private function generatePublicationPrompt($topic, $platform, $mode, $targetAudience): string
    {
        return 'Publication: Abracadabra';
    }
    

    private function generateSalesPrompt($topic, $platform, $writingTechnique): string
    {
        return 'Sales: Abracadabra';
    }
}
