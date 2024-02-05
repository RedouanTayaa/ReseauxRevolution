export interface ApiResponse<T = unknown> {
  message?: string;
  success: boolean;
  failed?: boolean;
  data?: T;
}
