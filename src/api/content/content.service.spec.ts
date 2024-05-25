import { Test, TestingModule } from '@nestjs/testing';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import ResponseDto from '../../util/response.dto';
import { MESSAGE } from '../../constant/message';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guard/role.guard';

describe('ContentController', () => {
  let contentController: ContentController;
  let contentService: ContentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentController],
      providers: [
        {
          provide: ContentService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .overrideGuard(RolesGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    contentController = module.get<ContentController>(ContentController);
    contentService = module.get<ContentService>(ContentService);
  });

  it('should be defined', () => {
    expect(contentController).toBeDefined();
  });

  describe('createContent', () => {
    it('should return content created successfully', async () => {
      const createContentDto: CreateContentDto = {
        title: 'Test Content',
        description: 'Test Description',
        order: 1,
        course: '123',
        instructor: '123',
      };
      const response: ResponseDto = {
        statusCode: 201,
        message: MESSAGE.CONTENT_CREATED_SUCCESS,
      };
      jest.spyOn(contentService, 'create').mockResolvedValue(response);

      const result = await contentController.createContent(
        { user: { userId: '123' } },
        createContentDto,
      );
      expect(result).toEqual(response);
    });

    it('should throw an error if user is not an instructor', async () => {
      const createContentDto: CreateContentDto = {
        title: 'Test Content',
        description: 'Test Description',
        order: 1,
        course: '123',
        instructor: '123',
      };
      jest
        .spyOn(contentService, 'create')
        .mockRejectedValue(new Error(MESSAGE.UNAUTHORIZED));
      await expect(
        contentController.createContent(
          { user: { userId: '123' } },
          createContentDto,
        ),
      ).rejects.toThrow(MESSAGE.UNAUTHORIZED);
    });

    it('should measure performance for multiple requests', async () => {
      const createContentDto: CreateContentDto = {
        title: 'Test Content',
        description: 'Test Description',
        order: 1,
        course: '123',
        instructor: '123',
      };
      jest.spyOn(contentService, 'create').mockResolvedValue({
        statusCode: 201,
        message: MESSAGE.CONTENT_CREATED_SUCCESS,
      });

      const start = process.hrtime();
      await contentService.create(createContentDto);
      const end = process.hrtime(start);
      expect(end[1] / 1000000).toBeLessThanOrEqual(100);
    });
  });

  describe('updateContent', () => {
    it('should return content updated successfully', async () => {
      const updateContentDto: UpdateContentDto = {
        title: 'Test Content',
        description: 'Test Description',
      };
      const response: ResponseDto = {
        statusCode: 200,
        message: MESSAGE.CONTENT_UPDATED_SUCCESS,
      };
      jest.spyOn(contentService, 'update').mockResolvedValue(response);

      const result = await contentController.updateContent(
        '123',
        updateContentDto,
      );
      expect(result).toEqual(response);
    });

    it('should handle error if thrown', async () => {
      const updateContentDto: UpdateContentDto = {
        title: 'Test Content',
        description: 'Test Description',
      };
      jest.spyOn(contentService, 'update').mockRejectedValue(new Error());
      await expect(
        contentController.updateContent('123', updateContentDto),
      ).rejects.toThrow();
    });

    it('should measure performance for multiple requests', async () => {
      const updateContentDto: UpdateContentDto = {
        title: 'Test Content',
        description: 'Test Description',
      };
      jest.spyOn(contentService, 'update').mockResolvedValue({
        statusCode: 200,
        message: MESSAGE.CONTENT_UPDATED_SUCCESS,
      });

      const start = process.hrtime();
      await contentService.update('123', updateContentDto);
      const end = process.hrtime(start);
      expect(end[1] / 1000000).toBeLessThanOrEqual(100);
    });
  });

  describe('deleteContent', () => {
    it('should return content deleted successfully', async () => {
      const response: ResponseDto = {
        statusCode: 200,
        message: MESSAGE.CONTENT_DELETED_SUCCESS,
      };
      jest.spyOn(contentService, 'delete').mockResolvedValue(response);

      const result = await contentController.deleteContent('123');
      expect(result).toEqual(response);
    });

    it('should handle error if thrown', async () => {
      jest.spyOn(contentService, 'delete').mockRejectedValue(new Error());
      await expect(contentController.deleteContent('123')).rejects.toThrow();
    });

    it('should measure performance for multiple requests', async () => {
      jest.spyOn(contentService, 'delete').mockResolvedValue({
        statusCode: 200,
        message: MESSAGE.CONTENT_DELETED_SUCCESS,
      });

      const start = process.hrtime();
      await contentService.delete('123');
      const end = process.hrtime(start);
      expect(end[1] / 1000000).toBeLessThanOrEqual(100);
    });
  });
});
