const next = require('next');
const { createServer } = require('http');
const routes = require('./routes');

if (process.env.NODE_ENV !== 'production') console.log('Starting in development mode');
else console.log('Starting in production mode');

const port = process.env.PORT || 3000;
const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
  createServer(handler).listen(port, (err) => {
    if (err) throw err;
    console.log(`Ready on localhost:${port}`);
  });
});
