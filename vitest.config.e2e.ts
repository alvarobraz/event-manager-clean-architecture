import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    environment: './test/vitest-environment-prisma/prisma-test-environment.ts',
    setupFiles: ['./test/setup-e2e.ts'],
    pool: 'forks',
    fileParallelism: false,
    maxWorkers: 1,
  },
})
