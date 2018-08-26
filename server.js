const next = require('next');
const routes = require('./routes');

if(process.env.NODE_ENV !== 'production') console.log("Starting in development mode")
else console.log("Starting in production mode")

const app = next({dev: process.env.NODE_ENV !== 'production'});
const handler = routes.getRequestHandler(app);
const port = process.env.PORT || 3000;

const {createServer} = require('http');

app.prepare().then(() => {
  createServer(handler).listen(port, (err)=>{
    if(err) throw err;
    console.log('Ready on localhost:' + port);
  })
})
