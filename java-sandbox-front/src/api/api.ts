import axios from 'axios'
export function compileCode(code: String) {
  return axios.post('/api/compileAndRun', {
    code
  })
}
