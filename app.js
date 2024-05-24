const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors'); // Import the CORS middleware

const app = new Koa();
const router = new Router(); // Create a router instance

// Middleware to parse request bodies
app.use(bodyParser());

// Enable CORS middleware
app.use(cors());

router.get('/', (ctx) => {
    ctx.status = 200;
    ctx.body = 'Hello World / Test CI/CD';
});
  
// Use the router routes
app.use(router.routes());
app.use(router.allowedMethods());

// Set the port
const PORT = process.env.PORT || 8000;

// Start the server
app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});
  