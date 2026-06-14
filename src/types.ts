export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  revokedAt: string | null;
}

export interface ApiRequest {
  id: string;
  model: string;
  tokensUsed: number;
  cost: number;
  status: number;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  clerkId: string;
  email: string;
  wallet: number;
  role: string;
  apiKeys: ApiKey[];
}
