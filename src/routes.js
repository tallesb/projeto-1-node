import {randomUUID} from 'node:crypto'

import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const search = req.query ? req.query.search : null

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search,
      } : null)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const {
        title,
        description,
      } = req.body

      if(!title || !description) return res.writeHead(400).end()

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      }

      const dbRes = database.insert('tasks', task)

      return res.writeHead(201).end(
        JSON.stringify(dbRes)
      )
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const {id} = req.params
      
      const {title, description} = req.body

      if(!title && !description) return res.writeHead(400).end()

      const task = database.select('tasks', {
        id,
      })[0]

      if(!task) return res.writeHead(400).end()

      if (title) task.title = title
      if (description) task.description = description

      database.update('tasks', id, {
        ...task,
        updated_at: new Date()
      })

      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const {id} = req.params

      if (!id) res.writeHead(400).end()

      let status = 204
      if (!database.delete('tasks', id)) status = 400

      return res.writeHead(status).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const {id} = req.params
      
      if (!id) return res.writeHead(400).end()

      const task = database.select('tasks', {
        id,
      })[0]

      if(!task) return res.writeHead(400).end()

      const {completed_at} = task

      database.update('tasks', id, {
        ...task,
        updated_at: new Date(),
        completed_at: completed_at ? null : new Date(),
      })

      return res.writeHead(204).end()
    }
  },
]