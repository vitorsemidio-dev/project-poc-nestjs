import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const uploadMiddleware = (options: {
  limits: { fileSize: number };
  allowedExtensions: string[];
}) => {
  const upload: MulterOptions = {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const randomName = Array(32)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('');
        callback(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
    limits: options.limits,
    fileFilter: (req, file, callback) => {
      if (!options.allowedExtensions.includes(extname(file.originalname))) {
        callback(
          new BadRequestException(
            `Somente arquivos com as seguintes extensões são permitidos: ${options.allowedExtensions.join(
              ', ',
            )}`,
          ),
          false,
        );
      }
      callback(null, true);
    },
  };
  return upload;
};
