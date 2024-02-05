<?php

namespace App\Tests;

use App\Service\OpenAIService;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

class ApiControllerTest extends WebTestCase
{
    public function testIndex()
    {
        $mockOpenAIService = $this->getMockBuilder(OpenAIService::class)
            ->disableOriginalConstructor()
            ->getMock();

        $openAIServiceReturn = [
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

        $mockOpenAIService
            ->method('postCompletion')
            ->with('test topic', 'AIDA')
            ->willReturn($openAIServiceReturn);

        $client = static::createClient();
        self::getContainer()->set(OpenAIService::class, $mockOpenAIService);

        $client->request(
            'POST',
            '/api/completion',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'topic' => 'test topic',
                'writingTechnique' => 'AIDA'
            ])
        );

        $this->assertEquals(Response::HTTP_OK, $client->getResponse()->getStatusCode());
        $contentJson = $client->getResponse()->getContent();
        $decodeContent = json_decode($contentJson);
        $this->assertJson($contentJson);
        $this->assertObjectHasProperty('id', $decodeContent);
        $this->assertObjectHasProperty('object', $decodeContent);
        $this->assertObjectHasProperty('created', $decodeContent);
        $this->assertObjectHasProperty('model', $decodeContent);
        $this->assertObjectHasProperty('choices', $decodeContent);
    }

    public function testIndexReturnError()
    {
        $mockOpenAIService = $this->getMockBuilder(OpenAIService::class)
            ->disableOriginalConstructor()
            ->getMock();

        $mockOpenAIService
            ->method('postCompletion')
            ->with('test topic', 'AIDA')
            ->willThrowException(new \Exception('OpenAI API request failed'));

        $client = static::createClient();
        self::getContainer()->set(OpenAIService::class, $mockOpenAIService);

        $client->request(
            'POST',
            '/api/completion',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'topic' => 'test topic',
                'writingTechnique' => 'AIDA'
            ])
        );

        $this->assertEquals(Response::HTTP_INTERNAL_SERVER_ERROR, $client->getResponse()->getStatusCode());
        $contentJson = $client->getResponse()->getContent();
        $decodeContent = json_decode($contentJson);
        $this->assertJson($contentJson);
        $this->assertObjectHasProperty('error', $decodeContent);
        $this->assertEquals('Failed to get completion from OpenAI', $decodeContent->error);
    }
}