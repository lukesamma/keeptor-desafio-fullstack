// ---------------------------------------------------------------------------
// npm run check
//
// Verificações rápidas do frontend (sem Docker): lint, typecheck, testes
// unitários e build. Para ambiente completo, rode também `npm run smoke`.
// ---------------------------------------------------------------------------
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const FRONTEND = path.join(ROOT, '..', 'frontend')

const PASSOS = ['lint', 'typecheck', 'test', 'build']

function rodar(script) {
  console.log(`\n> frontend: npm run ${script}\n`)
  const resultado = spawnSync('npm', ['run', script], {
    cwd: FRONTEND,
    stdio: 'inherit',
    shell: true,
  })
  if (resultado.status !== 0) {
    process.exit(resultado.status ?? 1)
  }
}

console.log('Check do frontend (lint · typecheck · test · build)\n')

for (const script of PASSOS) {
  rodar(script)
}

console.log('\nCheck OK. Para validar Docker/login: npm run smoke\n')
