import * as fsExtra from 'fs-extra';

type MakeFakeFileOptions = {
  sizeInMB?: number;
  filename?: string;
};

export const makeFakeFile = async (override: MakeFakeFileOptions = {}) => {
  const optiosn = {
    sizeInMB: 1,
    filename: `fakefile.txt`,
    ...override,
  };
  const MB = 1024 * 1024;
  const { sizeInMB, filename } = optiosn;
  const destination = `tmp/${filename}`;

  const buffer = Buffer.alloc(MB * sizeInMB, 0);

  await fsExtra.writeFile(destination, buffer);

  return {
    filePath: destination,
    buffer,
  };
};
