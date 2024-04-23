import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

export const databaseConfig = MongooseModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get('DB_URL'),
    dbName: configService.get('DB_NAME'),
  }),
  inject: [ConfigService],
});
