import { AxiosError } from 'axios';

class AuroraPromiseError<T = unknown, D = any> {
  name: string;
  msg: string;
  errorCode: string | undefined;
  requestStatus: any;
  responseStatus: number;
  axiosInstanceConfig: any;
  constructor(axiosError: AxiosError<T, D>) {
    this.name = 'AuroraPromiseError';
    this.msg = axiosError.message;
    this.errorCode = axiosError.code;
    this.requestStatus = axiosError.request.status;
    this.responseStatus = axiosError.response?.status ?? 500;
    this.axiosInstanceConfig = axiosError.config;
  }
}

class AuroraInstanceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuroraInstanceError';
  }
}

class AuroraClassError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuroraClassError';
  }
}

export { AuroraPromiseError, AuroraInstanceError, AuroraClassError };
