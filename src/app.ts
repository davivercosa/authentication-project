import bodyParser from 'body-parser';
import express, { Application } from 'express';

import { router } from './routes/routes';

const app: Application = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
  }),
);

app.use('/', router);

app.listen(3000, () => {
  console.log(`Server's up on http://localhost:3000/`);
});
