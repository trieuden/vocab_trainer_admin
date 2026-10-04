import { vocabApiClient } from "@/core/connectors";

export interface SystemConfigItem {
  id: string;
  code: string;
  description?: string;
  value: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function getSystemConfigs(): Promise<SystemConfigItem[]> {
  try {
    const response = await vocabApiClient.post("/system-config/list");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch system configs", error);
    throw error;
  }
}

export async function getSystemConfigDetail(code: string): Promise<string> {
  try {
    const response = await vocabApiClient.post("/system-config/detail", { code });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch system config detail", error);
    throw error;
  }
}

export async function updateSystemConfig(
  code: string,
  value: string,
  description?: string
): Promise<SystemConfigItem> {
  try {
    const response = await vocabApiClient.put("/system-config/update", {
      code,
      value,
      description,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update system config", error);
    throw error;
  }
}
