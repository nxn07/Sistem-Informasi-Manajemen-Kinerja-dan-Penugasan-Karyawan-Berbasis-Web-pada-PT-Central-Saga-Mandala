<?php

namespace App\Services\Contracts;

interface EvaluationServiceInterface
{
    public function getAllEvaluations();
    public function getEvaluationById(int $id);
    public function createEvaluation(array $data);
    public function updateEvaluation(int $id, array $data);
    public function deleteEvaluation(int $id);
}
