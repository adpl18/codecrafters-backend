const { User } = require('../models');

// Get all users
const getUsers = async (ctx) => {
  try {
    const users = await User.findAll();
    // Send response
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
  if (!userId || userId < 0) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid user ID' };
    return;
  }

  try {
    const user = await User.findByPk(userId);
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

// Create a new user
const createUser = async (ctx) => {
  const { firstName, lastName, email, birthdate } = ctx.request.body;
  if (!firstName || !lastName || !email || !birthdate) {
    ctx.status = 400;
    ctx.body = { error: 'Missing required fields' };
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
  if (!userId || userId < 0) {
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
  if (!userId || userId < 0) {
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
  createUser,
  updateUser,
  deleteUser,
};
