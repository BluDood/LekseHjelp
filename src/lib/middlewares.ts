import express, {
  Application,
  NextFunction,
  Request,
  RequestHandler,
  Response
} from 'express'
import { router } from 'express-file-routing'
import cors from 'cors'
import { getToken } from './tokens.js'
import path from 'path'

async function getHandler(): Promise<RequestHandler | null> {
  const handler = await import(
    'file://' + path.join(process.cwd(), 'web/build/handler.js')
  ).catch(() => {
    console.log('Site not built, not registering handler')
    return { handler: null }
  })

  return handler.handler
}

async function auth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization
  if (!auth) return next()

  const [type, token] = auth.split(' ')
  if (!type || !token) return next()

  if (type === 'token') {
    const found = await getToken(token, true)
    if (!found) return next()
    req.user = {
      ...found.user,
      token: {
        id: found.id,
        hash: found.hash
      }
    }
  }

  next()
}

export async function setupMiddlewares(app: Application) {
  app.use(cors())
  app.use(express.json())
  app.use(auth)
  app.use(
    '/api',
    await router({
      directory: path.join(process.cwd(), 'dist', 'routes')
    })
  )
  app.use(express.static(path.join(process.cwd(), 'web', 'build')))
  const handler = await getHandler()
  if (handler) app.use(handler)
}
