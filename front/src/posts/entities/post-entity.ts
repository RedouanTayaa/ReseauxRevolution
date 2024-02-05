export interface PostEntity {
  id?: number;
  topic: string;
  platform: string;
  choice: string;
  writingTechnique?: string;
  mode?: string;
  openAiResponse?: string;
  targetAudience?: string;
  createdAt: string;
}
