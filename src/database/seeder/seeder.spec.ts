import {Seeder} from './seeder';

describe('toto', () => {
  const seeder = new Seeder();
  it('should work', async () => {
    const data = await seeder.seed('user', 'test');
    expect(data).toBeTruthy();
  });
});
