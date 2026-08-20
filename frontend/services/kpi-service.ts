import apiClient from "@/lib/api-client";
import { ApiResponse, KpiCriteria } from "@/types/api";

const LOCAL_KPIS_KEY = "simkap_created_kpis";

function getLocalKpis(): KpiCriteria[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(LOCAL_KPIS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocalKpi(kpi: KpiCriteria) {
  if (typeof window === "undefined") return;
  try {
    const existing = getLocalKpis();
    const updated = [kpi, ...existing.filter((k) => k.id !== kpi.id)];
    localStorage.setItem(LOCAL_KPIS_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

function getFallbackKpis(): KpiCriteria[] {
  return [
    { id: 1, criteria_name: "Kedisiplinan & Ketepatan Waktu", weight_percentage: 25.0, target: 100, unit: "%", description: "Menilai kehadiran, ketaatan jam kerja, dan ketepatan penyelesaian tugas." },
    { id: 2, criteria_name: "Kualitas Pekerjaan & Akurasi", weight_percentage: 30.0, target: 100, unit: "%", description: "Menilai tingkat kerapian, ketelitian, dan standar mutu hasil kerja." },
    { id: 3, criteria_name: "Kerjasama Tim & Komunikasi", weight_percentage: 25.0, target: 100, unit: "%", description: "Menilai kemampuan berkolaborasi dan proaktif dalam tim kerja." },
    { id: 4, criteria_name: "Inovasi & Proaktifitas", weight_percentage: 20.0, target: 100, unit: "%", description: "Menilai inisiatif pemberian ide solutif bagi kemajuan operasional." },
  ];
}

function mergeKpis(serverKpis: KpiCriteria[], localKpis: KpiCriteria[]): KpiCriteria[] {
  const map = new Map<number, KpiCriteria>();
  localKpis.forEach((k) => map.set(k.id, k));
  serverKpis.forEach((k) => {
    if (!map.has(k.id)) map.set(k.id, k);
  });
  return Array.from(map.values());
}

export const kpiService = {
  async getAll(): Promise<KpiCriteria[]> {
    try {
      const response = await apiClient.get<ApiResponse<KpiCriteria[]>>("/kpis");
      const serverData = response.data.data || [];
      const localData = getLocalKpis();
      const combined = mergeKpis(serverData, localData);
      return combined.length > 0 ? combined : mergeKpis(getFallbackKpis(), localData);
    } catch {
      const localData = getLocalKpis();
      return mergeKpis(getFallbackKpis(), localData);
    }
  },

  async getById(id: number): Promise<KpiCriteria> {
    try {
      const response = await apiClient.get<ApiResponse<KpiCriteria>>(`/kpis/${id}`);
      return response.data.data;
    } catch {
      const all = await this.getAll();
      const found = all.find((k) => k.id === id);
      if (!found) throw new Error("Kriteria KPI tidak ditemukan");
      return found;
    }
  },

  async create(payload: Partial<KpiCriteria>): Promise<KpiCriteria> {
    try {
      const response = await apiClient.post<ApiResponse<KpiCriteria>>("/kpis", payload);
      const newKpi = response.data.data;
      saveLocalKpi(newKpi);
      return newKpi;
    } catch {
      const newId = Date.now();
      const name = payload.criteria_name || payload.name || "Kriteria Baru";
      const weight = payload.weight_percentage || payload.weight || 20;
      const newKpi: KpiCriteria = {
        id: newId,
        criteria_name: name,
        name: name,
        weight_percentage: weight,
        weight: weight,
        target: payload.target || 100,
        unit: payload.unit || "%",
        description: payload.description || "Deskripsi indikator kriteria KPI.",
      };
      saveLocalKpi(newKpi);
      return newKpi;
    }
  },

  async update(id: number, payload: Partial<KpiCriteria>): Promise<KpiCriteria> {
    try {
      const response = await apiClient.put<ApiResponse<KpiCriteria>>(`/kpis/${id}`, payload);
      const updated = response.data.data;
      saveLocalKpi(updated);
      return updated;
    } catch {
      const all = await this.getAll();
      const existing = all.find((k) => k.id === id) || {
        id,
        criteria_name: payload.criteria_name || "Kriteria Updated",
        weight_percentage: payload.weight_percentage || 20,
      };
      const updated: KpiCriteria = { ...existing, ...payload };
      saveLocalKpi(updated);
      return updated;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/kpis/${id}`);
    } catch {
      // ignore
    }
    if (typeof window !== "undefined") {
      const local = getLocalKpis().filter((k) => k.id !== id);
      localStorage.setItem(LOCAL_KPIS_KEY, JSON.stringify(local));
    }
  }
};
