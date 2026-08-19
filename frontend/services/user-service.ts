import apiClient from "@/lib/api-client";
import { ApiResponse, User, Employee } from "@/types/api";

export const userService = {
  async getAll(): Promise<User[]> {
    const response = await apiClient.get<ApiResponse<User[]>>("/users");
    return response.data.data;
  },
};
