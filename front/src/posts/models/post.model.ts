export interface PostModel {
  id?: number;
  topic: string;
  choice: string;
  writingTechnique?: string;
  mode?: string;
  platform: string;
  text?: string;
  targetAudience?: string;
  createdAt: string;
}
