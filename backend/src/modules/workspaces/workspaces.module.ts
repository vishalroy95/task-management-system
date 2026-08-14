import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Workspace, WorkspaceSchema } from "./entities/workspace.entity";
import { WorkspacesController } from "./workspaces.controller";
import { WorkspacesService } from "./workspaces.service";

@Module({
  controllers: [WorkspacesController],
  imports: [MongooseModule.forFeature([{ name: Workspace.name, schema: WorkspaceSchema }])],
  providers: [WorkspacesService],
})
export class WorkspacesModule {}
