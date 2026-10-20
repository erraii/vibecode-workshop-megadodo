import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import { homedir } from 'node:os';
import { join } from 'node:path';

export const defaultDataDir = () => process.env.DATA_DIR || join(homedir(), '.local/share/vibecode-workshop/data');
export const token = () => randomBytes(32).toString('hex');
// One process serialises complete read/change/atomic-write transactions. Run one app instance.
export function createStore(directory) {
  let queue = Promise.resolve();
  return operation => {
    const result = queue.then(async () => {
      await mkdir(directory, { recursive: true, mode: 0o700 });
      const file = join(directory, 'exchanges.json');
      let data;
      try { data = JSON.parse(await readFile(file, 'utf8')); }
      catch (error) { if (error.code !== 'ENOENT') throw error; data = { exchanges: [] }; }
      const result = await operation(data);
      if (result.write) {
        const temporary = join(directory, `exchanges-${token()}.tmp`);
        await writeFile(temporary, JSON.stringify(data), { mode: 0o600 });
        await rename(temporary, file);
      }
      return result.value;
    });
    queue = result.catch(() => {});
    return result;
  };
}
