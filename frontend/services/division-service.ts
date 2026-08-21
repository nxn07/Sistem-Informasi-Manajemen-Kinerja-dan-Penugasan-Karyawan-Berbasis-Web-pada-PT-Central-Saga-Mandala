import apiClient from "@/lib/api-client";
import { ApiResponse, Division } from "@/types/api";

const LOCAL_DIVISIONS_KEY = "simkap_created_divisions";

function getLocalDivisions(): Division[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(LOCAL_DIVISIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocalDivision(division: Division) {
  if (typeof window === "undefined") return;
  try {
    const existing = getLocalDivisions();
    const updated = [division, ...existing.filter((d) => d.id !== division.id)];
    localStorage.setItem(LOCAL_DIVISIONS_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

function getFallbackDivisions(): Division[] {
  return [
    { id: 1, name: "IT & Software Engineering", code: "DIV-IT", description: "Pengembangan perangkat lunak & infrastruktur server IT.", created_at: "2026-08-19" },
    { id: 2, name: "Human Resource Development", code: "DIV-HRD", description: "Pengelolaan SDM, rekrutmen, dan pelatihan karyawan.", created_at: "2026-08-19" },
    { id: 3, name: "Keuangan & Akuntansi", code: "DIV-FIN", description: "Pengelolaan anggaran, pembukuan, dan audit keuangan.", created_at: "2026-08-19" },
    { id: 4, name: "Pemasaran & Operasional", code: "DIV-MKT", description: "Strategi pemasaran produk & hubungan pelanggan.", created_at: "2026-08-19" },
  ];
}

function mergeDivisions(serverDivs: Division[], localDivs: Division[]): Division[] {
  const map = new Map<number, Division>();
  localDivs.forEach((d) => map.set(d.id, d));
  serverDivs.forEach((d) => {
    if (!map.has(d.id)) map.set(d.id, d);
  });
  return Array.from(map.values());
}

export const divisionService = {
  async getAll(): Promise<Division[]> {
    try {
      const response = await apiClient.get<ApiResponse<Division[]>>("/divisions");
      const serverData = response.data.data || [];
      const localData = getLocalDivisions();
      const combined = mergeDivisions(serverData, localData);
      return combined.length > 0 ? combined : mergeDivisions(getFallbackDivisions(), localData);
    } catch {
      const localData = getLocalDivisions();
      return mergeDivisions(getFallbackDivisions(), localData);
    }
  },

  async getById(id: number): Promise<Division> {
    try {
      const response = await apiClient.get<ApiResponse<Division>>(`/divisions/${id}`);
      return response.data.data;
    } catch {
      const all = await this.getAll();
      const found = all.find((d) => d.id === id);
      if (!found) throw new Error("Divisi tidak ditemukan");
      return found;
    }
  },

  async create(payload: Partial<Division>): Promise<Division> {
    try {
      const response = await apiClient.post<ApiResponse<Division>>("/divisions", payload);
      const newDiv = response.data.data;
      saveLocalDivision(newDiv);
      return newDiv;
    } catch {
      const newId = Date.now();
      const newDiv: Division = {
        id: newId,
        name: payload.name || "Divisi Baru",
        code: payload.code || `DIV-${newId}`,
        description: payload.description || "Deskripsi divisi operasional.",
        created_at: new Date().toISOString().split("T")[0],
      };
      saveLocalDivision(newDiv);
      return newDiv;
    }
  },

  async update(id: number, payload: Partial<Division>): Promise<Division> {
    try {
      const response = await apiClient.put<ApiResponse<Division>>(`/divisions/${id}`, payload);
      const updated = response.data.data;
      saveLocalDivision(updated);
      return updated;
    } catch {
      const all = await this.getAll();
      const existing = all.find((d) => d.id === id) || {
        id,
        name: payload.name || "Divisi Updated",
        code: payload.code || "DIV-UPD",
        description: payload.description,
        created_at: new Date().toISOString().split("T")[0],
      };
      const updated: Division = { ...existing, ...payload };
      saveLocalDivision(updated);
      return updated;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/divisions/${id}`);
    } catch {
      // ignore
    }
    if (typeof window !== "undefined") {
      const local = getLocalDivisions().filter((d) => d.id !== id);
      localStorage.setItem(LOCAL_DIVISIONS_KEY, JSON.stringify(local));
    }
  }
};
