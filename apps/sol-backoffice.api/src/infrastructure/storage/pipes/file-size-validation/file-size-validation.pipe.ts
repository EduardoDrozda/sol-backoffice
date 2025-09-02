import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      return value;
    }

    const maxSize = 10 * 1024 * 1024;

    if (Array.isArray(value)) {
      for (const file of value) {
        if (file.size > maxSize) {
          throw new BadRequestException(`File size exceeds the maximum limit of ${maxSize / 1024 / 1024} MB`);
        }
      }

      return value;
    }

    if (value.size > maxSize) {
      throw new BadRequestException(`File size exceeds the maximum limit of ${maxSize / 1024 / 1024} MB`);
    }

    return value;
  }
}
