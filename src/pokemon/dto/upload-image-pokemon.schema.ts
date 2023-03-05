import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const ImagemUploadSchema: SchemaObject | ReferenceObject = {
  type: 'object',
  properties: {
    imagem: {
      type: 'string',
      format: 'binary',
    },
  },
};
