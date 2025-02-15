export interface UserLogin {
  Email: string;
  Password: string;
  RememberMe: boolean;

  messageError: string;
  styleMessageError: boolean;
}
