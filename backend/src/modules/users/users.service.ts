import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { Model } from "mongoose";

import { CrudService } from "../../common/services/crud-service";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService extends CrudService<User> {
  constructor(
    @InjectModel(User.name)
    usersRepository: Model<User>,
  ) {
    super(usersRepository, "User");
  }
}
