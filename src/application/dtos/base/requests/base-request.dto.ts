import { IsOptional } from "class-validator";

export class BaseRequestDTO {
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  companyId: string | null;
}