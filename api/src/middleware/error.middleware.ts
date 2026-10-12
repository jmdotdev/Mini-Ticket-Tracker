import type { ErrorRequestHandler } from 'express';

const errorMiddleware: ErrorRequestHandler = (error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({
    error: 'Something went wrong. Check the API and database logs.',
  });
};

export default errorMiddleware;