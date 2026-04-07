import users1 from './users.json';
import users2 from './users2.json';
import users3 from './users3.json';

export interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  registrationDate: string;
  role?: 'admin' | 'buyer' | 'seller';
  status?: 'active' | 'inactive';
}

// Combine all user data
export const allUsers: UserData[] = [
  ...users1,
  ...users2,
  ...users3
].map(user => ({
  ...user,
  role: 'buyer' as const,
  status: 'active' as const
}));

export default allUsers;
