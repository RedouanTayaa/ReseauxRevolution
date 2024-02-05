<?php

namespace App\Controller;

use Symfony\Component\ErrorHandler\Exception\FlattenException;
use Symfony\Component\HttpFoundation\JsonResponse;

class ErrorController
{
    public function show(FlattenException $exception): JsonResponse
    {
        $data = [
            'message' => $exception->getMessage(),
        ];

        return new JsonResponse($data, $exception->getStatusCode());
    }
}