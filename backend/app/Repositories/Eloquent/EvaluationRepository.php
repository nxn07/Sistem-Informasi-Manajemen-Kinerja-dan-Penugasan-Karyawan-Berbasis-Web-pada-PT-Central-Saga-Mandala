<?php

namespace App\Repositories\Eloquent;

use App\Models\PerformanceEvaluation;
use App\Repositories\Contracts\EvaluationRepositoryInterface;

class EvaluationRepository implements EvaluationRepositoryInterface
{
    public function getAll()
    {
        return PerformanceEvaluation::with(['task', 'employee', 'evaluatorManager', 'kpiCriteria'])->get();
    }

    public function findById(int $id)
    {
        return PerformanceEvaluation::with(['task', 'employee', 'evaluatorManager', 'kpiCriteria'])->findOrFail($id);
    }

    public function create(array $data)
    {
        return PerformanceEvaluation::create($data);
    }

    public function update(int $id, array $data)
    {
        $evaluation = $this->findById($id);
        $evaluation->update($data);
        return $evaluation;
    }

    public function delete(int $id)
    {
        $evaluation = $this->findById($id);
        return $evaluation->delete();
    }
}
