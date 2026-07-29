// Vercel serverless entry — re-exports the Express app as the default handler.
// This file lives inside the server/ folder (CommonJS tsconfig) so it compiles
// correctly even though the project root has "type":"module".
import { app } from '../index';

export default app;
