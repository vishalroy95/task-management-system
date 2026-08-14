import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { Model } from "mongoose";

import { CrudService } from "../../common/services/crud-service";
import { Comment } from "./entities/comment.entity";

@Injectable()
export class CommentsService extends CrudService<Comment> {
  constructor(
    @InjectModel(Comment.name)
    commentsRepository: Model<Comment>,
  ) {
    super(commentsRepository, "Comment");
  }
}
