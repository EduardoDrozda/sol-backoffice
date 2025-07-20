import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FileRequiredPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      throw new BadRequestException('at least one file is required');
    }

    return value;
  }
}
