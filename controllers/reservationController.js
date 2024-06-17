const { Reservation } = require('../models');

async function getReservations(ctx) {
  try {
    const reservations = await Reservation.findAll();
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
      const reservation = await Reservation.create({ courseId, userId, availabilityId, isCancelled: false});
      ctx.status = 201;
      ctx.body = { reservation };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
      console.error('Error creating reservation:', error);
    }
}
  
async function updateReservation(ctx) {
    const reservationId = parseInt(ctx.params.id);
    if (!reservationId || reservationId < 0) {
      ctx.status = 400;
      ctx.body = { error: 'Invalid reservation ID' };
      return;
    }
  
    const { courseId, userId, availabilityId, isCancelled } = ctx.request.body;
    if (!courseId || !userId || !availabilityId || isCancelled) {
      ctx.status = 400;
      ctx.body = { error: 'Missing required fields' };
      return;
    }
  
    try {
      const reservation = await Reservation.findByPk(reservationId);
      if (!reservation) {
        ctx.status = 404;
        ctx.body = { error: 'Reservation not found' };
        return;
      }
  
      await reservation.update({ courseId, userId, availabilityId, isCancelled });
      ctx.status = 200;
      ctx.body = { reservation };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
      console.error('Error updating reservation:', error);
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
          where: { userId: userId }
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
  updateReservation,
  deleteReservation,
  getReservationsByUser,
  getReservationsByCourse,
  cancelReservation,
  getActiveReservations,
  getReservationsByDate,
};
