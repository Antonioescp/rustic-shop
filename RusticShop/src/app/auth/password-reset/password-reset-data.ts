export default interface PasswordResetData {
  password: string;
  confirmPassword: string;
  username: string;
  token: string;
}