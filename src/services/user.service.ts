import { inject, injectable } from "inversify";
import { TYPES } from "../domian/constant/types";
 import { UserRepository } from "../database/repository/User";
import { IUser } from "../models/interfaces/user.interfact";
import { Repository } from "typeorm";
import { User } from "../database/entity/User";

export interface IUserService {
    getUsers: () => Promise<Array<IUser>>;
}

@injectable()
class UserService implements IUserService {
    @inject(TYPES.Repository.User)
     private userRepository: Repository<User>;

     constructor() {
        this.userRepository =  UserRepository;
    }

    getUsers = async (): Promise<IUser[]> => {
        try {
            const users = await this.userRepository.find();
            return users;
        } catch (e) {
            throw new Error("Unable to get users")
        }
    };
}

export default UserService;