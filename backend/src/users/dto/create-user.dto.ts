export class CreateUserDto {
  fullName: string;
  email: string;
  password: string;
  role?: string; // 'admin' veya 'user' (isteğe bağlı)
}