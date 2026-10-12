import express from 'express';
import errorMiddleware from './middleware/error.middleware.ts';
import ticketRoutes from './routes/ticket.routes.ts';

const app = express();

app.use(express.json());
app.use('/tickets', ticketRoutes);
app.use(errorMiddleware);

export default app;