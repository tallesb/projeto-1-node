import {parse} from 'csv';
import fs from 'node:fs'
import {Readable} from 'node:stream'

const tasksPath = new URL('./tasks.csv', import.meta.url)

class UploadTasksCSVStream extends Readable {
  async _read() {
    const tasksStream = fs.createReadStream(tasksPath)

    const tasksParser = tasksStream.pipe(parse())

    let isFirstRow = true;

    for await (const chunck of tasksParser) {
      if(isFirstRow) {
        isFirstRow = false
        continue
      }
      
      const [title, description] = chunck

      const task = {
        title, description
      }

      const bufferedTask = Buffer.from(JSON.stringify(task))

      this.emit('data', bufferedTask)
    }

    this.push(null)
  }
}

const uploadTasks = new UploadTasksCSVStream()

uploadTasks.on('data', (data) => {
  fetch('http://localhost:3335/tasks', {
    method: 'POST',
    duplex: 'half',
    body: data
  })
})