import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

const configExpress = (app) => {
  app.use(cors())
  app.use(morgan('dev'))
  app.use(express.json())
}

export default configExpress