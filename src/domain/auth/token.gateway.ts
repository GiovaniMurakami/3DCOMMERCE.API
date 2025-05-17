interface TokenService {
  sign(payload: object): string;
  verify(token: string): object | null | undefined;
}