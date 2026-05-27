import { randomUUID } from 'node:crypto';

export const DataFactory = {
  uniqueEmail: (prefix = 'qa') => `${prefix}.${Date.now()}.${randomUUID().slice(0, 6)}@shopist.io`,
  strongPassword: () => `Sh0p!${randomUUID().slice(0, 8)}`,
  longString: (len) => 'a'.repeat(len),
  validCheckout: () => ({
    name: 'Jane QA',
    email: `jane.${Date.now()}@shopist.io`,
    card: '4111111111111111',
    month: '12',
    year: '2030',
    postal: '10001',
  }),
};
