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
    const { courseId, userId, availabilityId, isCancelled } = ctx.request.body;
    if (!courseId || !userId || !availabilityId || isCancelled === undefined) {
      ctx.status = 400;
      ctx.body = { error: 'Missing required fields' };
      return;
    }
  
    try {
      const reservation = await Reservation.create({ courseId, userId, availabilityId, isCancelled });
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
    if (!courseId || !userId || !availabilityId || isCancelled === undefined) {
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

module.exports = {
  getReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
};
