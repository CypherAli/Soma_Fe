import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const args = process.argv.slice(2);
// Keep generated FE/BE content contracts in step before starting either compiler.
if (args[0] === 'dev' || args[0] === 'build') {
  const sync = spawn(process.execPath, [fileURLToPath(new URL('./sync-content-catalog.mjs', import.meta.url))], { stdio: 'inherit', windowsHide: true });
  const code = await new Promise((resolve) => { sync.on('error', () => resolve(1)); sync.on('exit', resolve); });
  if (code !== 0) process.exit(Number(code) || 1);
}
// WASM compilation works under Windows Application Control; Turbopack requires a native DLL.
if (process.platform === 'win32' && !args.includes('--turbopack') && !args.includes('--turbo') && !args.includes('--webpack')) args.push('--webpack');
const child = spawn(process.execPath, [require.resolve('next/dist/bin/next'), ...args], { stdio: 'inherit', windowsHide: true });
child.on('error', error => { console.error(error); process.exitCode = 1; });
child.on('exit', code => { process.exitCode = code ?? 1; });
