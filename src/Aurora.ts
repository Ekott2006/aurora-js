import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { AuroraInstanceError, AuroraPromiseError } from './errors';
import { AuroraCallOptions, AuroraHeaders, AuroraParams } from './types';

/**
 * A class for managing HTTP requests with concurrent request limits and abort control.
 */
export default class Aurora {
  private axiosInstance: AxiosInstance;
  private requests = { max: 0, current: 0 };
  private defaultAbortController: AbortController;

  /**
   * Creates an instance of the Aurora class.
   * @param url - The base URL for all HTTP requests.
   * @param maxConcurrentRequests - The maximum number of concurrent requests allowed.
   * @param abortController - An optional AbortController instance for request cancellation.
   */
  constructor({
    url = '',
    maxConcurrentRequests = Number.POSITIVE_INFINITY,
    abortController = new AbortController(),
    axiosInstance = axios.create(),
  } = {}) {
    this.axiosInstance = axiosInstance;
    this.axiosInstance.defaults.baseURL = url;
    this.setMaxConcurrentRequestsLimit(maxConcurrentRequests);
    this.defaultAbortController = abortController;
  }

  /**
   * Sets the maximum of concurrent request limit
   * @param limit - Empty or zero disables request limit
   */
  setMaxConcurrentRequestsLimit(limit?: number) {
    this.requests.max = limit && limit > 0 ? limit : Number.POSITIVE_INFINITY;
  }

  private normalizeUrl(baseURL: string, endpoint: string): string {
    if (!baseURL.trim() && !endpoint.trim()) {
      throw new AuroraInstanceError('URL cannot be null');
    }
    const cleanBaseURL = baseURL.replace(/\/+$/, '');
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    return cleanBaseURL ? `${cleanBaseURL}/${cleanEndpoint}` : cleanEndpoint;
  }

  /**
   * Makes an HTTP request with the specified method and options.
   * @param method - The HTTP method (e.g., 'get', 'post').
   * @param options - The options for the request, including abortController, loadingCallback, endpoint, etc.
   * @returns A promise that resolves with an object containing response, error, hasError, and recall function.
   * @throws AuroraInstanceError if the number of concurrent requests exceeds the limit.
   */
  async call(
    method: string,
    {
      abortController = this.defaultAbortController,
      loadingCallback,
      ...options
    }: AuroraCallOptions
  ) {
    if (this.requests.current >= this.requests.max) {
      throw new AuroraInstanceError('Request limit exceeded');
    }
    this.requests.current++;

    let response: AxiosResponse | null = null;
    let error: AuroraPromiseError | null = null;
    let hasError = false;

    try {
      const url = this.normalizeUrl(
        this.axiosInstance.defaults.baseURL ?? "",
        options.endpoint ?? ''
      );

      if (loadingCallback) loadingCallback(true);
      response = await this.axiosInstance({
        ...options,
        url,
        signal: abortController?.signal,
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        error = new AuroraPromiseError(err as AxiosError);
        hasError = true;
      } else {
        throw err;
      }
    } finally {
      this.requests.current--;
      if (loadingCallback) loadingCallback(false);
    }

    return {
      response,
      error,
      hasError,
      recall: (customOptions: Partial<AuroraCallOptions> = {}) =>
        this.call(method, { ...options, ...customOptions }),
    };
  }

  /**
   * Adds headers to all subsequent requests.
   * @param headers - An object containing headers to be added.
   */
  addHeaders(headers: AuroraHeaders) {
    Object.assign(this.axiosInstance.defaults.headers.common, headers);
  }

  /**
   * Removes headers from all subsequent requests.
   * @param headerNames - An optional array of header names to remove. If undefined, all headers are removed.
   */
  removeHeaders(headerNames?: string[]) {
    if (headerNames === undefined) {
      this.axiosInstance.defaults.headers.common = {};
    } else {
      headerNames.forEach((header) => {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete this.axiosInstance.defaults.headers.common[header];
      });
    }
  }

  /**
   * Adds query parameters to all subsequent requests.
   * @param params - An object containing query parameters to be added.
   */
  addParams(params: AuroraParams) {
    Object.assign(this.axiosInstance.defaults.params, params);
  }

  /**
   * Removes query parameters from all subsequent requests.
   * @param paramNames - An optional array of parameter names to remove. If undefined, all parameters are removed.
   */
  removeParams(paramNames?: string[]) {
    if (paramNames === undefined) {
      this.axiosInstance.defaults.params = {};
    }
    paramNames?.forEach((param) => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.axiosInstance.defaults.params[param];
    });
  }

  /**
   * Sets the timeout for all subsequent requests.
   * @param timeout - The timeout value in milliseconds.
   */
  setTimeout(timeout: number) {
    this.axiosInstance.defaults.timeout = timeout;
  }

  /**
   * Removes the timeout for all subsequent requests.
   */
  removeTimeout() {
    delete this.axiosInstance.defaults.timeout;
  }

  /**
   * Aborts all ongoing requests.
   */
  abortAll() {
    this.defaultAbortController.abort();
  }

  /**
   * Makes a POST request.
   * @param options - The options for the request.
   * @returns A promise that resolves with the result of the request.
   */
  post = (options: AuroraCallOptions) => this.call('post', options);

  /**
   * Makes a GET request.
   * @param options - The options for the request.
   * @returns A promise that resolves with the result of the request.
   */
  get = (options: AuroraCallOptions) => this.call('get', options);

  /**
   * Makes a DELETE request.
   * @param options - The options for the request.
   * @returns A promise that resolves with the result of the request.
   */
  delete = (options: AuroraCallOptions) => this.call('delete', options);

  /**
   * Makes a PUT request.
   * @param options - The options for the request.
   * @returns A promise that resolves with the result of the request.
   */
  put = (options: AuroraCallOptions) => this.call('put', options);
}
