const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors'); // Import the CORS middleware

const userController = require('./controllers/userController');
const courseController = require('./controllers/courseController');
const availabilityController = require('./controllers/availabilityController');
const reservationController = require('./controllers/reservationController');
const reviewController = require('./controllers/reviewController');



const app = new Koa();
const router = new Router(); // Create a router instance

// Middleware to parse request bodies
app.use(bodyParser());

// Enable CORS middleware
app.use(cors());

router.get('/users', userController.getUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

router.get('/courses', courseController.getCourses);
router.get('/courses/:id', courseController.getCourseById);
router.post('/courses', courseController.createCourse);
router.put('/courses/:id', courseController.updateCourse);
router.delete('/courses/:id', courseController.deleteCourse);

router.get('/availabilities', availabilityController.getAvailabilities);
router.get('/availabilities/:id', availabilityController.getAvailabilityById);
router.post('/availabilities', availabilityController.createAvailability);
router.put('/availabilities/:id', availabilityController.updateAvailability);
router.delete('/availabilities/:id', availabilityController.deleteAvailability);

router.get('/reservations', reservationController.getReservations);
router.get('/reservations/:id', reservationController.getReservationById);
router.post('/reservations', reservationController.createReservation);
router.put('/reservations/:id', reservationController.updateReservation);
router.delete('/reservations/:id', reservationController.deleteReservation);

router.get('/reviews', reviewController.getReviews);
router.get('/reviews/:id', reviewController.getReviewById);
router.post('/reviews', reviewController.createReview);
router.put('/reviews/:id', reviewController.updateReview);
router.delete('/reviews/:id', reviewController.deleteReview);



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
  