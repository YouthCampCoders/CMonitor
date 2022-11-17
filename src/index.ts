import { handleGetFCP } from './performance'

handleGetFCP()

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
