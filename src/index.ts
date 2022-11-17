// export * from './performance'
import { PerformanceMetrics } from './performance'

interface ITest {
  input: string
  output: string
  format: string
}

const lib: ITest = {
  input: 'index.ts',
  output: 'lib',
  format: 'esm'
}

const p = new PerformanceMetrics()
setTimeout(() => {
  p.endMark('a')
}, 2000)

console.log(lib.format)
