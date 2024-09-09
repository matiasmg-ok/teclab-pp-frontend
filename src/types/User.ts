export type User = {
  name: string;
  email: string;
  password: string;
  profile: 'admin' | 'client'
}