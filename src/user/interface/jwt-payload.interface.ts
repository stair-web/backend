export interface JwtPayload {
  email: string;
  role?: string;
  uuid: string;
  roles?: any[];
}
