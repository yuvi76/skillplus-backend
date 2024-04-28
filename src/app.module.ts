import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './api/users/users.module';
import { AuthModule } from './api/auth/auth.module';
import { CourseModule } from './api/course/course.module';
import { ReviewModule } from './api/review/review.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('DB_URL'),
        dbName: configService.get('DB_NAME'),
      }),
      inject: [ConfigService],
    }),
    CacheModule.register({ isGlobal: true }),
    UsersModule,
    AuthModule,
    CourseModule,
    ReviewModule,
  ],
})
export class AppModule {}
