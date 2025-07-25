import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ToggleUserStatusDTO {
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
} 