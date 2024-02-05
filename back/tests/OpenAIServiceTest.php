<?php

namespace App\Tests;

use PHPUnit\Framework\TestCase;
use App\Service\OpenAIService;
use Symfony\Component\HttpClient\Response\MockResponse;

class OpenAIServiceTest extends TestCase
{
    public function testPostCompletion()
    {
        $responseOpenAI = [
            'id' => '12345abcd',
            'object' => [
                'test' => 'it\'s ok',
            ],
            'created' => '2023-11-11T15:26:30',
            'model' => 'AIDA',
            'choices' => [
                'every choices',
            ],
        ];
        $responses = [
            'https://api.openai.com/v1/chat/completions' => new MockResponse(json_encode($responseOpenAI)),
        ];
        $client = new FakeHttpClient($responses);
        $service = new OpenAIService($client, 'apikey', 'https://api.openai.com/v1/chat/completions', 'AIDA');

        $response = $service->postCompletion('test topic', 'AIDA');
        // Vérifiez que la réponse est un tableau
        $this->assertIsArray($response);

        // Vérifiez que certains champs attendus sont présents
        $this->assertArrayHasKey('id', $response);
        $this->assertArrayHasKey('object', $response);
        $this->assertArrayHasKey('created', $response);
        $this->assertArrayHasKey('model', $response);
        $this->assertArrayHasKey('choices', $response);
    }

    /**
     * @return void
     * @throws \Exception
     *
     */
    public function testPostCompletionWithoutApiKey()
    {
        $this->expectExceptionMessage("OpenAI API key not defined");
        $responseOpenAI = [
            'id' => '12345abcd',
            'object' => [
                'test' => 'it\'s ok',
            ],
            'created' => '2023-11-11T15:26:30',
            'model' => 'AIDA',
            'choices' => [
                'every choices',
            ],
        ];
        $responses = [
            'https://api.openai.com/v1/chat/completions' => new MockResponse(json_encode($responseOpenAI)),
        ];
        $client = new FakeHttpClient($responses);

        new OpenAIService($client);
    }
}
