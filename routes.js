const routes = require('next-routes')(); //this is a function

routes
.add('/search','index')
.add('/about','about');

module.exports = routes;
