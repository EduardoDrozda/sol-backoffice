export interface IBaseResponse {
  error: boolean;
  errorMessages?: string[];
  result?: any;
  statusCode?: number;
  timestamp?: string;
}