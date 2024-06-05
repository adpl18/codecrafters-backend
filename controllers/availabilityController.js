const { Availability } = require('../models');

async function getAvailabilities(ctx) {
    try {
        const availabilities = await Availability.findAll();
        ctx.status = 200;
        ctx.body = { availabilities };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'An error occurred while fetching availabilities.' };
        console.error('Error fetching availabilities:', error);
    }
}

async function getAvailabilityById(ctx) {
    const availabilityId = parseInt(ctx.params.id);
    if (!availabilityId || availabilityId < 0) {
        ctx.status = 400;
        ctx.body = { error: 'Invalid availability ID' };
        return;
    }

    try {
        const availability = await Availability.findByPk(availabilityId);
        if (!availability) {
        ctx.status = 404;
        ctx.body = { error: 'Availability not found' };
        } else {
        ctx.status = 200;
        ctx.body = { availability };
        }
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Internal server error' };
        console.error('Error fetching availability by ID:', error);
    }
}

async function createAvailability(ctx) {
    const { date, startTime, endTime, isAvailable, userId } = ctx.request.body;
    if (!date || !startTime || !endTime || !isAvailable || !userId) {
      ctx.status = 400;
      ctx.body = { error: 'Missing required fields' };
      return;
    }
  
    try {
      const availability = await Availability.create({ date, startTime, endTime, isAvailable, userId });
      ctx.status = 201;
      ctx.body = { availability };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
      console.error('Error creating availability:', error);
    }
  }

async function updateAvailability(ctx) {
    const availabilityId = parseInt(ctx.params.id);
    if (!availabilityId || availabilityId < 0) {
      ctx.status = 400;
      ctx.body = { error: 'Invalid availability ID' };
      return;
    }
  
    const { date, startTime, endTime, isAvailable, userId } = ctx.request.body;
    if (!date || !startTime || !endTime || !isAvailable || !userId) {
      ctx.status = 400;
      ctx.body = { error: 'Missing required fields' };
      return;
    }
  
    try {
      const availability = await Availability.findByPk(availabilityId);
      if (!availability) {
        ctx.status = 404;
        ctx.body = { error: 'Availability not found' };
        return;
      }
  
      await availability.update({ date, startTime, endTime, isAvailable, userId });
      ctx.status = 200;
      ctx.body = { availability };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
      console.error('Error updating availability:', error);
    }
}
  


async function deleteAvailability(ctx) {
    const availabilityId = parseInt(ctx.params.id);
    if (!availabilityId || availabilityId < 0) {
        ctx.status = 400;
        ctx.body = { error: 'Invalid availability ID' };
        return;
    }

    try {
        const availability = await Availability.findByPk(availabilityId);
        if (!availability) {
        ctx.status = 404;
        ctx.body = { error: 'Availability not found' };
        return;
        }

        await availability.destroy();
        ctx.status = 200;
        ctx.body = { message: 'Availability deleted successfully' };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Internal server error' };
        console.error('Error deleting availability:', error);
    }
}

module.exports = {
  getAvailabilities,
  getAvailabilityById,
  createAvailability,
  updateAvailability,
  deleteAvailability,
};

