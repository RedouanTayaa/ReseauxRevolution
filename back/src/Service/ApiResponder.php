<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\JsonResponse;

class ApiResponder
{
    public function createResponse(bool $success = true, $data = null, string $message = ''): JsonResponse
    {
        $response = [
            'success' => $success,
            'data' => $data,
            'message' => $message,
        ];

        return new JsonResponse($response);
    }
}