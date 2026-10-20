import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const args = process.argv.slice(2);
// WASM compilation works under Windows Application Control; Turbopack requires a native DLL.
if (process.platform === 'win32' && !args.includes('--turbopack') && !args.includes('--turbo') && !args.includes('--webpack')) args.push('--webpack');
const child = spawn(process.execPath, [require.resolve('next/dist/bin/next'), ...args], { stdio: 'inherit', windowsHide: true });
child.on('error', error => { console.error(error); process.exitCode = 1; });
child.on('exit', code => { process.exitCode = code ?? 1; });
