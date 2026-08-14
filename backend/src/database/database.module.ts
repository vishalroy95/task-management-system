import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import type { MongooseModuleOptions } from "@nestjs/mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let memoryServer: MongoMemoryServer | undefined;

async function resolveMongoUri(configService: ConfigService): Promise<string> {
  const configuredUri = configService.get<string>("database.uri");
  const shouldUseMemoryMongo = configService.get<boolean>("database.useMemoryMongo");

  if (!shouldUseMemoryMongo) {
    return configuredUri ?? "mongodb://127.0.0.1:27017/ag_assignment";
  }

  if (!memoryServer) {
    memoryServer = await MongoMemoryServer.create();
  }

  return memoryServer.getUri();
}

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<MongooseModuleOptions> => ({
        uri: await resolveMongoUri(configService),
      }),
    }),
  ],
})
export class DatabaseModule {}
