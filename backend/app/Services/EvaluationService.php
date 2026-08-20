<?php

namespace App\Services;

use App\Repositories\Contracts\EvaluationRepositoryInterface;
use App\Services\Contracts\EvaluationServiceInterface;

class EvaluationService implements EvaluationServiceInterface
{
    protected $evaluationRepository;

    public function __construct(EvaluationRepositoryInterface $evaluationRepository)
    {
        $this->evaluationRepository = $evaluationRepository;
    }

    public function getAllEvaluations()
    {
        return $this->evaluationRepository->getAll();
    }

    public function getEvaluationById(int $id)
    {
        return $this->evaluationRepository->findById($id);
    }

    public function createEvaluation(array $data)
    {
        return $this->evaluationRepository->create($data);
    }

    public function updateEvaluation(int $id, array $data)
    {
        return $this->evaluationRepository->update($id, $data);
    }

    public function deleteEvaluation(int $id)
    {
        return $this->evaluationRepository->delete($id);
    }
}
