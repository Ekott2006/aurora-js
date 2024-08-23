import { AxiosRequestConfig } from 'axios';

export interface AuroraHeaders {
  Accept?: string;
  'Accept-Encoding'?: string;
  'Accept-Language'?: string;
  Authorization?: string;
  'Content-Type'?: string;
  'Content-Length'?: string;
  Cookie?: string;
  Date?: string;
  Host?: string;
  'If-Modified-Since'?: string;
  Referer?: string;
  'User-Agent'?: string;
  'X-Requested-With'?: string;
  'Cache-Control'?: string;
  Expires?: string;
  Pragma?: string;
  Location?: string;
  ETag?: string;
  'Access-Control-Allow-Origin'?: string;

  // Custom Headers
  [header: string]: string | undefined;
}
export type AuroraParams = Record<string, string | number | object >;

export type AuroraCallOptions = Omit<AxiosRequestConfig, 'url' | 'baseURL'> & {
  endpoint?: string;
  abortController?: AbortController | null;
  loadingCallback?: (isLoading: boolean) => void;
};
