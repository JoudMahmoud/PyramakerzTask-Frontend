export interface UserRegister {
  UserName: string;
  Password: string;
  confirmPassword: string;
  Email: string;
  Gender: 'M'|'F';

  messageError: string;
  styleMessageError: boolean;
}
