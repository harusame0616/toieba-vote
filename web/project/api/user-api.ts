import { UserProfile } from '../domains/models/user/user';
import { UserDto } from '../domains/usecases/user-query-usecase';

export type { UserProfile };

export interface UserApi {
  getUserByUserId(userId: string): Promise<UserDto>;
  getUserByAuthenticationId(authenticationId: string): Promise<UserDto>;
  createUser(profile: UserProfile, authenticationId: string): Promise<void>;
  editProfile(userId: string, profile: UserProfile): Promise<void>;
}
