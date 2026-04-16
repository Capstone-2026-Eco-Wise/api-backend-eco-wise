import app from './app.ts';
import { env } from './utils/env.ts';

app.listen(env.PORT, () => {
  console.log(`Server is running on http://${env.HOST}:${env.PORT}`);
});
