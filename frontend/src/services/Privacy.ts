import api from "./api";

export type PrivacyRequestInput = {
  requesterName: string;
  requesterEmail: string;
  subjectType: "PATIENT" | "USER" | "EMPLOYEE" | "OTHER";
  requestType: "ACCESS" | "CORRECTION" | "PORTABILITY" | "DELETION" | "ANONYMIZATION" | "CONSENT_REVOCATION" | "SHARING_INFORMATION" | "OTHER";
  description?: string;
};

export type PrivacyRequestReceipt = {
  protocol: string;
  accessToken: string;
  status: string;
  createdAt: string;
};

export const privacyService = {
  createRequest: async (input: PrivacyRequestInput): Promise<PrivacyRequestReceipt> => {
    const response = await api.post<{ data: PrivacyRequestReceipt }>("/privacy/requests", input);
    return response.data.data;
  },
  getStatus: async (protocol: string, accessToken: string) => {
    const response = await api.get<{ data: Omit<PrivacyRequestReceipt, "accessToken"> }>(`/privacy/requests/${encodeURIComponent(protocol)}/status`, {
      headers: { "X-Request-Access-Token": accessToken },
    });
    return response.data.data;
  },
};
