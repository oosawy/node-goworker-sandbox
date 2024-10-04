import childprocess from 'child_process'
import readline from 'readline'
import { EventEmitter, once } from 'events'

class Worker extends EventEmitter {
  constructor() {
    super()
    this.process = childprocess.spawn('go', ['run', 'main.go'])
    this.process.on('exit', () => {
      this.emit('exit')
    })

    this.reader = readline.createInterface({
      input: this.process.stdout,
    })
    this.reader.on('line', (line) => {
      this.handleLine(line)
    })
  }

  handleLine(line) {
    this.emit('message', line)
  }

  async call(msg) {
    this.process.stdin.write(msg + '\n')
    const [reply] = await once(this, 'message')
    return reply
  }

  exit() {
    this.process.kill()
  }
}

const worker = new Worker()

worker.on('exit', () => {
  console.log('worker exit')
})

console.log(await worker.call('hello\n'))
