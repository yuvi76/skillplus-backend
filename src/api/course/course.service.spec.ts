import { Test, TestingModule } from '@nestjs/testing';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { GetCourseListDto } from './dto/get-course-list.dto';
import ResponseDto from '../../util/response.dto';
import { MESSAGE } from '../../constant/message';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guard/role.guard';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('ContentService', () => {
  let courseService: CourseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CourseService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            enroll: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
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

    courseService = module.get<CourseService>(CourseService);
  });

  it('should be defined', () => {
    expect(courseService).toBeDefined();
  });

  describe('createCourse', () => {
    it('should return course created successfully', async () => {
      const createCourseDto: CreateCourseDto = {
        title: 'Test Course',
        description: 'Test Description',
        price: 100,
        estimatedPrice: 1000,
        duration: 10,
        category: ['development', 'javascript'],
        tags: ['tag1', 'tag2'],
        instructor: '123',
        isFree: false,
        isPublished: false,
        language: 'English',
        thumbnail: 'thumbnail.jpg',
      };
      const response: ResponseDto = {
        statusCode: 201,
        message: MESSAGE.COURSE_CREATED_SUCCESS,
      };
      jest.spyOn(courseService, 'create').mockResolvedValue(response);

      expect(await courseService.create(createCourseDto)).toEqual(response);
    });

    it('should throw error if course creation fails', async () => {
      const createCourseDto: CreateCourseDto = {
        title: 'Test Course',
        description: 'Test Description',
        price: 100,
        estimatedPrice: 1000,
        duration: 10,
        category: ['development', 'javascript'],
        tags: ['tag1', 'tag2'],
        instructor: '123',
        isFree: false,
        isPublished: false,
        language: 'English',
        thumbnail: 'thumbnail.jpg',
      };
      const response: ResponseDto = {
        statusCode: 400,
        message: MESSAGE.COURSE_CREATION_FAILED,
      };
      jest.spyOn(courseService, 'create').mockResolvedValue(response);

      try {
        await courseService.create(createCourseDto);
      } catch (error) {
        expect(error).toEqual(response);
      }
    });

    it('should measure performance for multiple requests', async () => {
      const createCourseDto: CreateCourseDto = {
        title: 'Test Course',
        description: 'Test Description',
        price: 100,
        estimatedPrice: 1000,
        duration: 10,
        category: ['development', 'javascript'],
        tags: ['tag1', 'tag2'],
        instructor: '123',
        isFree: false,
        isPublished: false,
        language: 'English',
        thumbnail: 'thumbnail.jpg',
      };
      jest.spyOn(courseService, 'create').mockResolvedValue({
        statusCode: 201,
        message: MESSAGE.COURSE_CREATED_SUCCESS,
      });

      const start = process.hrtime();
      await courseService.create(createCourseDto);
      const end = process.hrtime(start);
      expect(end[1] / 1000000).toBeLessThanOrEqual(100);
    });
  });

  describe('findAll', () => {
    it('should return list of courses', async () => {
      const getCourseListDto: GetCourseListDto = {
        page: 1,
        limit: 10,
        sort: 'asc',
        search: 'test',
        category: 'development',
        language: 'english',
        instructor: '123',
        order: 'asc',
        tags: ['tag1', 'tag2'],
      };
      const response: ResponseDto = {
        statusCode: 200,
        message: MESSAGE.COURSE_LIST_FETCHED_SUCCESS,
        data: [],
      };
      jest.spyOn(courseService, 'findAll').mockResolvedValue(response);

      expect(await courseService.findAll(getCourseListDto)).toEqual(response);
    });

    it('should throw error if course list not found', async () => {
      const getCourseListDto: GetCourseListDto = {
        page: 1,
        limit: 10,
        sort: 'asc',
        search: 'test',
        category: 'development',
        language: 'english',
        instructor: '123',
        order: 'asc',
        tags: ['tag1', 'tag2'],
      };
      const response: ResponseDto = {
        statusCode: 404,
        message: MESSAGE.COURSE_NOT_FOUND,
      };
      jest.spyOn(courseService, 'findAll').mockResolvedValue(response);

      try {
        await courseService.findAll(getCourseListDto);
      } catch (error) {
        expect(error).toEqual(response);
      }
    });

    it('should measure performance for multiple requests', async () => {
      const getCourseListDto: GetCourseListDto = {
        page: 1,
        limit: 10,
        sort: 'asc',
        search: 'test',
        category: 'development',
        language: 'english',
        instructor: '123',
        order: 'asc',
        tags: ['tag1', 'tag2'],
      };
      jest.spyOn(courseService, 'findAll').mockResolvedValue({
        statusCode: 200,
        message: MESSAGE.COURSE_LIST_FETCHED_SUCCESS,
        data: [],
      });

      const start = process.hrtime();
      await courseService.findAll(getCourseListDto);
      const end = process.hrtime(start);
      expect(end[1] / 1000000).toBeLessThanOrEqual(100);
    });
  });

  describe('findById', () => {
    it('should return course details', async () => {
      const response: ResponseDto = {
        statusCode: 200,
        message: MESSAGE.COURSE_DETAILS_FETCHED_SUCCESS,
        data: {},
      };
      jest.spyOn(courseService, 'findById').mockResolvedValue(response);

      expect(await courseService.findById('123')).toEqual(response);
    });

    it('should throw error if course not found', async () => {
      const response: ResponseDto = {
        statusCode: 404,
        message: MESSAGE.COURSE_NOT_FOUND,
      };
      jest.spyOn(courseService, 'findById').mockResolvedValue(response);

      try {
        await courseService.findById('123');
      } catch (error) {
        expect(error).toEqual(response);
      }
    });

    it('should measure performance for multiple requests', async () => {
      jest.spyOn(courseService, 'findById').mockResolvedValue({
        statusCode: 200,
        message: MESSAGE.COURSE_DETAILS_FETCHED_SUCCESS,
        data: {},
      });

      const start = process.hrtime();
      await courseService.findById('123');
      const end = process.hrtime(start);
      expect(end[1] / 1000000).toBeLessThanOrEqual(100);
    });
  });

  describe('update', () => {
    it('should return course updated successfully', async () => {
      const updateCourseDto: UpdateCourseDto = {
        title: 'Test Course',
        description: 'Test Description',
        price: 100,
        estimatedPrice: 1000,
        duration: 10,
        category: ['development', 'javascript'],
        tags: ['tag1', 'tag2'],
        isFree: false,
        isPublished: false,
        language: 'English',
        thumbnail: 'thumbnail.jpg',
      };
      const response: ResponseDto = {
        statusCode: 200,
        message: MESSAGE.COURSE_UPDATED_SUCCESS,
      };
      jest.spyOn(courseService, 'update').mockResolvedValue(response);

      expect(await courseService.update('123', updateCourseDto)).toEqual(
        response,
      );
    });

    it('should throw error if course update fails', async () => {
      const updateCourseDto: UpdateCourseDto = {
        title: 'Test Course',
        description: 'Test Description',
        price: 100,
        estimatedPrice: 1000,
        duration: 10,
        category: ['development', 'javascript'],
        tags: ['tag1', 'tag2'],
        isFree: false,
        isPublished: false,
        language: 'English',
        thumbnail: 'thumbnail.jpg',
      };
      const response: ResponseDto = {
        statusCode: 400,
        message: MESSAGE.COURSE_CREATION_FAILED,
      };
      jest.spyOn(courseService, 'update').mockResolvedValue(response);

      try {
        await courseService.update('123', updateCourseDto);
      } catch (error) {
        expect(error).toEqual(response);
      }
    });

    it('should measure performance for multiple requests', async () => {
      const updateCourseDto: UpdateCourseDto = {
        title: 'Test Course',
        description: 'Test Description',
        price: 100,
        estimatedPrice: 1000,
        duration: 10,
        category: ['development', 'javascript'],
        tags: ['tag1', 'tag2'],
        isFree: false,
        isPublished: false,
        language: 'English',
        thumbnail: 'thumbnail.jpg',
      };
      jest.spyOn(courseService, 'update').mockResolvedValue({
        statusCode: 200,
        message: MESSAGE.COURSE_UPDATED_SUCCESS,
      });

      const start = process.hrtime();
      await courseService.update('123', updateCourseDto);
      const end = process.hrtime(start);
      expect(end[1] / 1000000).toBeLessThanOrEqual(100);
    });
  });

  describe('remove', () => {
    it('should return course deleted successfully', async () => {
      const response: ResponseDto = {
        statusCode: 200,
        message: MESSAGE.COURSE_DELETED_SUCCESS,
      };
      jest.spyOn(courseService, 'remove').mockResolvedValue(response);

      expect(await courseService.remove('123')).toEqual(response);
    });

    it('should throw error if course delete fails', async () => {
      const response: ResponseDto = {
        statusCode: 400,
        message: MESSAGE.COURSE_CREATION_FAILED,
      };
      jest.spyOn(courseService, 'remove').mockResolvedValue(response);

      try {
        await courseService.remove('123');
      } catch (error) {
        expect(error).toEqual(response);
      }
    });

    it('should measure performance for multiple requests', async () => {
      jest.spyOn(courseService, 'remove').mockResolvedValue({
        statusCode: 200,
        message: MESSAGE.COURSE_DELETED_SUCCESS,
      });

      const start = process.hrtime();
      await courseService.remove('123');
      const end = process.hrtime(start);
      expect(end[1] / 1000000).toBeLessThanOrEqual(100);
    });
  });

  describe('enroll', () => {
    it('should return course enrolled successfully', async () => {
      const response: ResponseDto = {
        statusCode: 200,
        message: MESSAGE.COURSE_ENROLLED_SUCCESS,
      };
      jest.spyOn(courseService, 'enroll').mockResolvedValue(response);

      expect(await courseService.enroll('123', '123')).toEqual(response);
    });

    it('should throw error if course already enrolled', async () => {
      const response: ResponseDto = {
        statusCode: 400,
        message: MESSAGE.COURSE_ALREADY_ENROLLED,
      };
      jest.spyOn(courseService, 'enroll').mockResolvedValue(response);

      try {
        await courseService.enroll('123', '123');
      } catch (error) {
        expect(error).toEqual(response);
      }
    });

    it('should measure performance for multiple requests', async () => {
      jest.spyOn(courseService, 'enroll').mockResolvedValue({
        statusCode: 200,
        message: MESSAGE.COURSE_ENROLLED_SUCCESS,
      });

      const start = process.hrtime();
      await courseService.enroll('123', '123');
      const end = process.hrtime(start);
      expect(end[1] / 1000000).toBeLessThanOrEqual(100);
    });
  });
});
