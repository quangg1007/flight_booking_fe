export interface UserModel {
  user_id?: number;
  first_name?: string;
  last_name?: string;
  email: string;
  password?: string;
  phone?: number;
  address?: string;
  profile_picture?: string;
  isAdmin?: string;
  date_of_birth?: Date;
  date_joined?: Date;
}
