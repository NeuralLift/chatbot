export interface Fetcher {
  <T>(
    url: string,
    options?: RequestInit
  ): Promise<{
    data: T;
    message: string;
    status: number;
    success: boolean;
    error?: string;
    errorCode?: string;
  }>;
}
