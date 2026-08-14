import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { CommentsController } from "./comments.controller";
import { CommentsService } from "./comments.service";
import { Comment, CommentSchema } from "./entities/comment.entity";

@Module({
  controllers: [CommentsController],
  imports: [MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }])],
  providers: [CommentsService],
})
export class CommentsModule {}
