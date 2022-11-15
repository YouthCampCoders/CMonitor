import { sum } from './sum'
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

console.log(lib.format)
console.log(sum(1, 2))
