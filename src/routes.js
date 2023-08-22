import oltRouter from './api/olt/index.js';
import automationRouter from './api/automation/index.js';

const routes = (app) => {
  app.use('/api/olts', oltRouter)
  app.use('/api/automation', automationRouter)
}

export default routes