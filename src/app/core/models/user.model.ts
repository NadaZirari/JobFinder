export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Optionnel car absent de la session
}

export type UserSession = Omit<User, 'password'>;
