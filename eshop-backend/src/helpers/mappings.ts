import { User } from "../../../shared/user";
import { UserEntity } from "../entities/userEntity";

//Create a Data Transfer Object (DTO) from the User Entity
export function createDTO(user: UserEntity): User {
  return {
    id: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    status: user.status,
    token: user.token,
    refreshToken: user.refreshToken,
    refreshTokenExpiry: user.refreshTokenExpiry,
  };
}
