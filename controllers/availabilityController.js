const { Availability } = require('../models');
const { Sequelize } = require('sequelize');

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
    const { date, startTime, endTime, userId } = ctx.request.body;
    if (!date || !startTime || !endTime || !userId) {
      ctx.status = 400;
      ctx.body = { error: 'Missing required fields' };
      return;
    }
  
    try {
      const availability = await Availability.create({ date, startTime, endTime, isAvailable: true, userId });
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
  
    const { date, startTime, endTime } = ctx.request.body;
    if (!date || !startTime || !endTime) {
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
  
      await availability.update({ date, startTime, endTime});
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
//nuevas funciones

async function getAvailabilitiesByUser(ctx) {
  const userId = parseInt(ctx.params.userId);
  if (!userId || userId < 0) {
      ctx.status = 400;
      ctx.body = { error: 'Invalid user ID' };
      return;
  }

  try {
      const availabilities = await Availability.findAll({
          where: { userId },
          
      });

      if (!availabilities.length) {
          ctx.status = 404;
          ctx.body = { error: 'No availabilities found for this user' };
      } else {
          ctx.status = 200;
          ctx.body = { availabilities };
      }
  } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
      console.error('Error fetching availabilities by user:', error);
  }
}

async function getAvailabilitiesByDateRange(ctx) {
  const { startDate, endDate } = ctx.request.body;
  if (!startDate || !endDate) {
      ctx.status = 400;
      ctx.body = { error: 'Start date and end date are required' };
      return;
  }

  try {
      const availabilities = await Availability.findAll({
          where: {
              date: {
                  [Sequelize.Op.between]: [new Date(startDate), new Date(endDate)]
              }
          }
      });

      if (!availabilities.length) {
          ctx.status = 404;
          ctx.body = { error: 'No availabilities found in the specified date range' };
      } else {
          ctx.status = 200;
          ctx.body = { availabilities };
      }
  } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
      console.error('Error fetching availabilities by date range:', error);
  }
}

async function updateAvailabilityStatus(ctx) {
    const availabilityId = parseInt(ctx.params.id);
    const { isAvailable } = ctx.request.body;
  
    if (!availabilityId || availabilityId < 0) {
      ctx.status = 400;
      ctx.body = { error: 'Invalid availability ID' };
      return;
    }
  
    if (typeof isAvailable !== 'boolean') {
      ctx.status = 400;
      ctx.body = { error: 'Invalid isAvailable value, it should be boolean' };
      return;
    }
  
    try {
      const availability = await Availability.findByPk(availabilityId);
      if (!availability) {
        ctx.status = 404;
        ctx.body = { error: 'Availability not found' };
        return;
      }
  
      await availability.update({ isAvailable });
      ctx.status = 200;
      ctx.body = { message: `Availability successfully ${isAvailable ? 'uncanceled' : 'canceled'}` };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
      console.error('Error updating availability status:', error);
    }
  }
  




module.exports = {
  getAvailabilities,
  getAvailabilityById,
  createAvailability,
  updateAvailability,
  deleteAvailability,
  getAvailabilitiesByUser,
  getAvailabilitiesByDateRange,
  updateAvailabilityStatus,
};

