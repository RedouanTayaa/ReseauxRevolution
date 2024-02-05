<?php

namespace App\Tests;

use Symfony\Component\HttpClient\MockHttpClient;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;
use Symfony\Contracts\HttpClient\ResponseStreamInterface;

class FakeHttpClient implements HttpClientInterface
{
    private array $responses;

    public function __construct(array $responses = [])
    {
        $this->responses = $responses;
    }
    public function request(string $method, string $url, array $options = []): ResponseInterface
    {
        $response = $this->responses[$url] ?? null;

        return (new MockHttpClient($response, 'https://user_service_api.fake'))->request($method, $url);
    }

    public function stream(iterable|ResponseInterface $responses, float $timeout = null): ResponseStreamInterface
    {
        throw new \LogicException(sprintf('%s() is not implemented', __METHOD__));
    }

    public function withOptions(array $options): static
    {
        return $this;
    }
}