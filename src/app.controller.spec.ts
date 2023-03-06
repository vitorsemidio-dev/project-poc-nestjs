import { makeFakeFile } from './../test/helpers/fake-file.factory';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  it.skip('create fake files', () => {
    const maxSize = 30;
    const extensions = ['jpg', 'png', 'pdf', 'geojson', 'json'];
    const bigFilesParams = extensions.map((ext) => {
      const sizeInMB = maxSize + 1;
      return {
        sizeInMB,
        filename: `${sizeInMB}_fakefile.${ext}`,
      };
    });
    const smallFilesParams = extensions.map((ext) => {
      const sizeInMB = maxSize - 15;
      return {
        sizeInMB,
        filename: `${sizeInMB}_fakefile.${ext}`,
      };
    });

    bigFilesParams.forEach(async (params) => {
      const { filePath, buffer } = await makeFakeFile(params);
      console.log(filePath, buffer.length);
    });
    smallFilesParams.forEach(async (params) => {
      const { filePath, buffer } = await makeFakeFile(params);
      console.log(filePath, buffer.length);
    });
  });
});
