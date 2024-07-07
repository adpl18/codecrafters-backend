const { User, Reservation, Availability, Course } = require('../models');

// Helper function to calculate age
const calculateAge = (birthdate) => {
  const birthDate = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Get all users
const getUsers = async (ctx) => {
  try {
    const users = await User.findAll();
    ctx.status = 200;
    ctx.body = { users };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
    console.error('Error fetching users:', error);
  }
};

// Get a user by ID
const getUserById = async (ctx) => {
  const userId = parseInt(ctx.params.id);
  if (isNaN(userId) || userId < 0) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid user ID' };
    return;
  }

  try {
    const user = await User.findByPk(userId, {
      include: [{
        model: Reservation,
        as: 'reservations',
        include: [
          {
            model: User,
            as: 'User'
          },
          {
            model: Availability,
            as: 'Availability'
          },
          {
            model: Course,
            as: 'Course'
          }
        ]
      }]
    });
    if (!user) {
      ctx.status = 404;
      ctx.body = { error: 'User not found' };
    } else {
      ctx.status = 200;
      ctx.body = { user };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
    console.error('Error fetching user by ID:', error);
  }
};

// Get a user by Email
const getUserByEmail = async (ctx) => {
  const email = ctx.params.email;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid email' };
    return;
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      ctx.status = 404;
      ctx.body = { error: 'User not found' };
    } else {
      ctx.status = 200;
      ctx.body = { user };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
    console.error('Error fetching user by email:', error);
  }
};

// Create a new user
const createUser = async (ctx) => {
  const { firstName, lastName, email, birthdate } = ctx.request.body;
  if (!firstName || !lastName || !email || !birthdate) {
    ctx.status = 400;
    ctx.body = { error: 'Missing required fields' };
    return;
  }

  if (isNaN(Date.parse(birthdate))) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid birthdate' };
    return;
  }

  if (calculateAge(birthdate) < 18) {
    ctx.status = 400;
    ctx.body = { error: 'You must be at least 18 years old to sign up.' };
    return;
  }

  try {
    const user = await User.create({ firstName, lastName, email, birthdate });
    ctx.status = 201;
    ctx.body = { user };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
    console.error('Error creating user:', error);
  }
};

// Update an existing user
const updateUser = async (ctx) => {
  const userId = parseInt(ctx.params.id);
  if (isNaN(userId) || userId < 0) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid user ID' };
    return;
  }

  const { firstName, lastName, birthdate } = ctx.request.body;
  if (!firstName || !lastName || !birthdate) {
    ctx.status = 400;
    ctx.body = { error: 'Missing required fields' };
    return;
  }

  if (isNaN(Date.parse(birthdate))) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid birthdate' };
    return;
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      ctx.status = 404;
      ctx.body = { error: 'User not found' };
      return;
    }

    await user.update({ firstName, lastName, birthdate });
    ctx.status = 200;
    ctx.body = { user };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
    console.error('Error updating user:', error);
  }
};

// Delete a user
const deleteUser = async (ctx) => {
  const userId = parseInt(ctx.params.id);
  if (isNaN(userId) || userId < 0) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid user ID' };
    return;
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      ctx.status = 404;
      ctx.body = { error: 'User not found' };
      return;
    }

    await user.destroy();
    ctx.status = 200;
    ctx.body = { message: 'User deleted successfully' };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
    console.error('Error deleting user:', error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
};
