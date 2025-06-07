import { validate as uuidValidate } from 'uuid';

export function isValidUuid(uuid: string): boolean {
  return uuidValidate(uuid);
}