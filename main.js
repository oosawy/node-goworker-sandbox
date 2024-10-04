import childprocess from 'child_process'
import readline from 'readline'
import { EventEmitter, on } from 'events'

class Worker extends EventEmitter {
  constructor() {
    super()

    this._messageId = 1

    this.process = childprocess.spawn('go', ['run', '.'])
    this.process.stderr.pipe(process.stderr)
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
    const sep = line.indexOf(',')
    const [id, reply] = [line.slice(0, sep), line.slice(sep + 1)]
    if (id == 0) {
      console.error('error reply', line)
      return
    }
    this.emit('_reply', id, reply)
  }

  async call(message) {
    const id = this._messageId++
    this.process.stdin.write(id + ',' + JSON.stringify(message) + '\n')

    for await (const [replyId, reply] of on(this, '_reply')) {
      if (replyId == id) return JSON.parse(reply)
      if (replyId == -id) throw new Error(reply)
    }
  }

  exit() {
    this.process.kill()
  }
}

const worker = new Worker()

worker.on('exit', () => {
  console.log('worker exit')
})

console.log(
  'result',
  await Promise.allSettled([
    worker.call({ type: 0, name: 'bob' }),
    worker.call({ type: 0, name: 'alice' }),
    worker.call({ type: 0, name: 'charlie' }),
  ])
)
