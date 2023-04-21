export interface RegistrationResponse {
  success: boolean;
  message: string;
  errors: string[];
  emailSent: boolean;
}
