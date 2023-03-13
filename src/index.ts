import { createApp } from './app';
import { startServer } from './server';

const app = createApp();

startServer(app)
  .then(() => {
    // This should never happen, is only here until we add the real API which of course runs forever
    console.info('API execution ended');
  })
  .catch((err) => {
    console.error('Shutting down...');
    if (err instanceof Error) {
      console.error(err);
    } else {
      console.error('An unknown error has occurred. Please open an issue on github (https://github.com/makerdao-ses/switchboard-boilerplate/issues/new) with the below context:');
      console.info(err);
    }
    process.exit(1);
  });
