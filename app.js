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
app.use(cors({
    origin: "*", // Ajusta según tus requerimientos de seguridad
    methods: ["GET", "POST", "PUT", "DELETE"] // Asegúrate de que POST está incluido
}));

router.get('/users', userController.getUsers);
router.get('/users/:id', userController.getUserById);
router.get('/users/email/:email', userController.getUserByEmail);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

router.get('/courses', courseController.getCourses);
router.get('/courses/:id', courseController.getCourseById);
router.get('/courses/avg-rating/:id', courseController.getAverageRatingForCourse);
router.get('/courses/teacher/:teacherId', courseController.getCoursesByTeacher);

router.post('/courses', courseController.createCourse);
router.put('/courses/:id', courseController.updateCourse);
router.put('/courses/:id/price', courseController.updateCoursePrice);
router.delete('/courses/:id', courseController.deleteCourse);

router.get('/availabilities', availabilityController.getAvailabilities);
router.get('/availabilities/:id', availabilityController.getAvailabilityById);
router.get('/availabilities/user/:userId', availabilityController.getAvailabilitiesByUser);

router.post('/availabilities', availabilityController.createAvailability);
router.post('/availabilities/daterange', availabilityController.getAvailabilitiesByDateRange);

router.put('/availabilities/:id', availabilityController.updateAvailability);
router.put('/availabilities/update-status/:id', availabilityController.updateAvailabilityStatus);

router.delete('/availabilities/:id', availabilityController.deleteAvailability);

router.get('/reservations', reservationController.getReservations);
router.get('/reservations/:id', reservationController.getReservationById);
router.get('/reservations/user/:userId', reservationController.getReservationsByUser);
router.get('/reservations/course/:courseId', reservationController.getReservationsByCourse);
router.get('/reservations/active', reservationController.getActiveReservations);
router.get('/reservations/date/:date', reservationController.getReservationsByDate);

router.post('/reservations', reservationController.createReservation);
router.put('/reservations/cancel/:id', reservationController.cancelReservation);
router.put('/reservations/review/:id', reservationController.reviewReservation);
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

module.exports = app;