import express,{type Express} from 'express';
import rootRouter from './routes/index.js';
import { errorMiddleware } from './middlewares/errors.js';

const app:Express = express();
app.use(express.json());

app.use('/api',rootRouter);

app.use(errorMiddleware);
const PORT = process.env.PORT ?? "3000";
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});