import { generateId, nowIso } from '../../../../packages/shared/utils';
import { MpesaTransaction } from '../types';
import { dbKeys, read, write } from './db';

export const mpesaService = {
  getAll(): MpesaTransaction[] {
    return read(dbKeys.mpesa, [] as MpesaTransaction[]);
  },
  addManual(payload: Omit<MpesaTransaction, 'id' | 'createdAt'>) {
    const tx: MpesaTransaction = { ...payload, id: generateId('mpesa'), createdAt: nowIso() };
    const list = this.getAll();
    list.unshift(tx);
    write(dbKeys.mpesa, list);
    return tx;
  },
};
