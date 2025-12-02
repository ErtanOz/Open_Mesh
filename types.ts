export interface Model {
  id: string;
  title: string;
  description: string;
  fileUrl: string; // Blob URL in mock, /uploads/filename in real
  fileName: string;
  thumbnail?: string; // Generated or placeholder
  license: string;
  sourceUrl?: string;
  region?: string;
  category: ModelCategory;
  tags: string[];
  createdAt: number;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  modelIds: string[];
  coverImage?: string;
  createdAt: number;
}

export enum ModelCategory {
  MONUMENT = 'Monument',
  BUILDING = 'Building',
  INFRASTRUCTURE = 'Infrastructure',
  ENVIRONMENT = 'Environment',
  ARTIFACT = 'Artifact',
  OTHER = 'Other',
}

export interface FilterState {
  search: string;
  category: string;
}