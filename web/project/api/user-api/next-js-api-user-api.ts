import { UserDto } from '../../domains/usecases/user-query-usecase';
import { http } from '../../library/http';
import { UserApi, UserProfile } from '../user-api';

export class NJAPIUserApi implements UserApi {
  async getUserByUserId(userId: string): Promise<UserDto> {
    const res = await http.get(`/api/users/${userId}`);
    return res.data ?? null;
  }
  async getUserByAuthenticationId(authenticationId: string): Promise<UserDto> {
    const res = await http.get(`/api/users/${authenticationId}`, {
      params: {
        type: 'firebase',
      },
    });
    return res.data ?? null;
  }

  async createUser(
    profile: UserProfile,
    authenticationId: string
  ): Promise<void> {
    await http.post(`/api/users/`, { profile, authenticationId });
  }

  async editProfile(userId: string, profile: UserProfile): Promise<void> {
    const res = await http.put(`/api/users/${userId}`, { params: profile });
    return res.data ?? null;
  }
}
