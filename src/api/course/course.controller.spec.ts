import { Test, TestingModule } from '@nestjs/testing';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { GetCourseListDto } from './dto/get-course-list.dto';
import ResponseDto from '../../util/response.dto';
import { MESSAGE } from '../../constant/message';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guard/role.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('CourseController', () => {
  let courseController: CourseController;
  let courseService: CourseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseController],
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
          provide: CacheInterceptor,
          useValue: {
            intercept: jest.fn(),
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

    courseController = module.get<CourseController>(CourseController);
    courseService = module.get<CourseService>(CourseService);
  });

  it('should be defined', () => {
    expect(courseController).toBeDefined();
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
        language: 'English',
        thumbnail: 'https://www.example.com/thumbnail.png',
        isFree: true,
        isPublished: true,
        instructor: '123',
      };
      const response: ResponseDto = {
        statusCode: 201,
        message: MESSAGE.COURSE_CREATED_SUCCESS,
      };
      jest.spyOn(courseService, 'create').mockResolvedValue(response);

      expect(
        await courseController.createCourse(
          { user: { userId: '123' } },
          createCourseDto,
        ),
      ).toBe(response);
    });
  });

  describe('getCourses', () => {
    it('should return list of courses', async () => {
      const getCourseListDto: GetCourseListDto = {
        page: 1,
        limit: 10,
        category: 'development',
        language: 'English',
        tags: ['tag1', 'tag2'],
        instructor: '123',
        order: 'asc',
        search: 'Test',
        sort: 'title',
      };
      const response: ResponseDto = {
        statusCode: 200,
        message: MESSAGE.COURSE_LIST_FETCHED_SUCCESS,
        data: [],
      };
      jest.spyOn(courseService, 'findAll').mockResolvedValue(response);

      expect(await courseController.getCourses(getCourseListDto)).toBe(
        response,
      );
    });
  });

  describe('getCourseById', () => {
    it('should return course details', async () => {
      const response: ResponseDto = {
        statusCode: 200,
        message: MESSAGE.COURSE_DETAILS_FETCHED_SUCCESS,
        data: {},
      };
      jest.spyOn(courseService, 'findById').mockResolvedValue(response);

      expect(await courseController.getCourseById('123')).toBe(response);
    });
  });

  describe('updateCourse', () => {
    it('should return course updated successfully', async () => {
      const updateCourseDto: UpdateCourseDto = {
        title: 'Test Course',
        description: 'Test Description',
        price: 100,
        estimatedPrice: 1000,
        duration: 10,
        category: ['development', 'javascript'],
        tags: ['tag1', 'tag2'],
        language: 'English',
        thumbnail: 'https://www.example.com/thumbnail.png',
        isFree: true,
        isPublished: true,
      };
      const response: ResponseDto = {
        statusCode: 200,
        message: MESSAGE.COURSE_UPDATED_SUCCESS,
      };
      jest.spyOn(courseService, 'update').mockResolvedValue(response);

      expect(await courseController.updateCourse('123', updateCourseDto)).toBe(
        response,
      );
    });
  });

  describe('deleteCourse', () => {
    it('should return course deleted successfully', async () => {
      const response: ResponseDto = {
        statusCode: 200,
        message: MESSAGE.COURSE_DELETED_SUCCESS,
      };
      jest.spyOn(courseService, 'remove').mockResolvedValue(response);

      expect(await courseController.deleteCourse('123')).toBe(response);
    });
  });

  describe('enrollInCourse', () => {
    it('should return course enrolled successfully', async () => {
      const response: ResponseDto = {
        statusCode: 200,
        message: MESSAGE.COURSE_ENROLLED_SUCCESS,
      };
      jest.spyOn(courseService, 'enroll').mockResolvedValue(response);

      expect(
        await courseController.enrollInCourse(
          { user: { userId: '123' } },
          '123',
        ),
      ).toBe(response);
    });
  });
});
