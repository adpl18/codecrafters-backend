const { Reservation, Course, Availability, User } = require('../models');

async function getReservations(ctx) {
  try {
    const reservations = await Reservation.findAll({
      include: [
        {
          model: Course,
          as: 'Course',
        },
        {
          model: User,
          as: 'User'
        },
        {
          model: Availability,
          as: 'Availability'
        }
      ]
    });
    ctx.status = 200;
    ctx.body = { reservations };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'An error occurred while fetching reservations.' };
    console.error('Error fetching reservations:', error);
  }
}

async function getReservationById(ctx) {
  const reservationId = parseInt(ctx.params.id);
  if (!reservationId || reservationId < 0) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid reservation ID' };
    return;
  }

  try {
    const reservation = await Reservation.findByPk(reservationId);
    if (!reservation) {
      ctx.status = 404;
      ctx.body = { error: 'Reservation not found' };
    } else {
      ctx.status = 200;
      ctx.body = { reservation };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
    console.error('Error fetching reservation by ID:', error);
  }
}

async function createReservation(ctx) {
    const { courseId, userId, availabilityId } = ctx.request.body;
    if (!courseId || !userId || !availabilityId) {
      ctx.status = 400;
      ctx.body = { error: 'Missing required fields' };
      return;
    }
  
    try {
      const reservation = await Reservation.create({ courseId, userId, availabilityId, isCancelled: false, isReviewed: false});
      ctx.status = 201;
      ctx.body = { reservation };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
      console.error('Error creating reservation:', error);
    }
} 

async function deleteReservation(ctx) {
  const reservationId = parseInt(ctx.params.id);
  if (!reservationId || reservationId < 0) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid reservation ID' };
    return;
  }

  try {
    const reservation = await Reservation.findByPk(reservationId);
    if (!reservation) {
      ctx.status = 404;
      ctx.body = { error: 'Reservation not found' };
      return;
    }

    await reservation.destroy();
    ctx.status = 200;
    ctx.body = { message: 'Reservation deleted successfully' };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
    console.error('Error deleting reservation:', error);
  }
}

//nuevas funciones

async function getReservationsByUser(ctx) {
  const userId = parseInt(ctx.params.userId);
  if (!userId || userId < 0) {
      ctx.status = 400;
      ctx.body = { error: 'Invalid user ID' };
      return;
  }

  try {
      const reservations = await Reservation.findAll({
        where: { userId: userId },
        include: [
          {
            model: Course,
            as: 'Course',
          },
          {
            model: User,
            as: 'User'
          },
          {
            model: Availability,
            as: 'Availability'
          }
        ]
      });

      if (reservations.length === 0) {
          ctx.status = 404;
          ctx.body = { error: 'No reservations found for this user' };
      } else {
          ctx.status = 200;
          ctx.body = { reservations };
      }
  } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
      console.error('Error fetching reservations by user:', error);
  }
}

async function getReservationsByCourse(ctx) {
  const courseId = parseInt(ctx.params.courseId);
  if (!courseId || courseId < 0) {
      ctx.status = 400;
      ctx.body = { error: 'Invalid course ID' };
      return;
  }

  try {
      const reservations = await Reservation.findAll({
          where: { courseId: courseId }
      });

      if (!reservations.length) {
          ctx.status = 404;
          ctx.body = { error: 'No reservations found for this course' };
      } else {
          ctx.status = 200;
          ctx.body = { reservations };
      }
  } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
      console.error('Error fetching reservations by course:', error);
  }
}

async function cancelReservation(ctx) {
  const reservationId = parseInt(ctx.params.id);
  if (!reservationId || reservationId < 0) {
      ctx.status = 400;
      ctx.body = { error: 'Invalid reservation ID' };
      return;
  }

  try {
      const reservation = await Reservation.findByPk(reservationId);
      if (!reservation) {
          ctx.status = 404;
          ctx.body = { error: 'Reservation not found' };
          return;
      }

      await reservation.update({ isCancelled: true });
      ctx.status = 200;
      ctx.body = { message: 'Reservation cancelled successfully', reservation };
  } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
      console.error('Error cancelling reservation:', error);
  }
}

async function reviewReservation(ctx) {
  const reservationId = parseInt(ctx.params.id);
  if (!reservationId || reservationId < 0) {
      ctx.status = 400;
      ctx.body = { error: 'Invalid reservation ID' };
      return;
  }

  try {
      const reservation = await Reservation.findByPk(reservationId);
      if (!reservation) {
          ctx.status = 404;
          ctx.body = { error: 'Reservation not found' };
          return;
      }

      await reservation.update({ isReviewed: true });
      ctx.status = 200;
      ctx.body = { message: 'Reservation reviewed successfully', reservation };
  } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
      console.error('Error reviewing reservation:', error);
  }
}

async function getActiveReservations(ctx) {
  try {
      const activeReservations = await Reservation.findAll({
          where: { isCancelled: false }
      });

      if (!activeReservations.length) {
          ctx.status = 404;
          ctx.body = { error: 'No active reservations found' };
      } else {
          ctx.status = 200;
          ctx.body = { activeReservations };
      }
  } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
      console.error('Error fetching active reservations:', error);
  }
}

async function getReservationsByDate(ctx) {
  const date = ctx.params.date; // Formato esperado: 'YYYY-MM-DD'
  try {
      const reservations = await Reservation.findAll({
          where: { createdAt: date }
      });

      if (!reservations.length) {
          ctx.status = 404;
          ctx.body = { error: 'No reservations found for this date' };
      } else {
          ctx.status = 200;
          ctx.body = { reservations };
      }
  } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
      console.error('Error fetching reservations by date:', error);
  }
}





module.exports = {
  getReservations,
  getReservationById,
  createReservation,
  deleteReservation,
  getReservationsByUser,
  getReservationsByCourse,
  cancelReservation,
  reviewReservation,
  getActiveReservations,
  getReservationsByDate,
};
