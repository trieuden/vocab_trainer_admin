import type { PageRequest } from '../base-dtos';

export interface GetUsersDto extends PageRequest {
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  type?: string;
}