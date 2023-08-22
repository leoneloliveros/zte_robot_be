import express from 'express'

import configExpress from './config/express.js'
import routes from './routes.js'


const app = express()
const port = process.env.PORT || 8080

//Setup Express
configExpress(app)

//Setup Routes
routes(app)

app.listen(port, () => {
  console.log("🚀 ~ file: app.js:17 ~ app.listen ~ port:", port)
})