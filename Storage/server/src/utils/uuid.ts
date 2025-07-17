import { nanoid } from 'nanoid';

export function getUuId() {
    return nanoid(64);
}