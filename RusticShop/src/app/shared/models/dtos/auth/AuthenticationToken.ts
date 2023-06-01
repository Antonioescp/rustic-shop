export interface AuthenticationToken {
  aud: string;
  exp: number;
  role: string | string[];
  iss: string;
}
