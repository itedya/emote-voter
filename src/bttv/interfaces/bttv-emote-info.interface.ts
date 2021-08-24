export interface BttvEmoteInfo {
  id: string;
  code: string;
  imageType: string;
  createdAt: string;
  updatedAt: string;
  global: boolean;
  live: boolean;
  sharing: boolean;
  approvalStatus: string;
  user: {
    id: string;
    name: string;
    displayName: string;
    providerId: string;
  }
}