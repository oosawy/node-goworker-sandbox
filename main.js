import childprocess from 'child_process'
import readline from 'readline'

const worker = childprocess.spawn('go', ['run', 'main.go'])

worker.on('exit', () => {
  console.log('worker exit')
})

worker.stdin.write('hello\n')

const reader = readline.createInterface({
  input: worker.stdout,
})

reader.on('line', (line) => {
  console.log(line)
})

reader.on('close', () => {
  console.log('closed')
})
