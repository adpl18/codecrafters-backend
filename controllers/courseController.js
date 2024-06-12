const { Course } = require('../models');

async function getCourses(ctx) {
  try {
    const courses = await Course.findAll();
    ctx.status = 200;
    ctx.body = { courses };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'An error occurred while fetching courses.' };
    console.error('Error fetching courses:', error);
  }
}

async function getCourseById(ctx) {
  const courseId = parseInt(ctx.params.id);
  if (!courseId || courseId < 0) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid course ID' };
    return;
  }

  try {
    const course = await Course.findByPk(courseId);
    if (!course) {
      ctx.status = 404;
      ctx.body = { error: 'Course not found' };
    } else {
      ctx.status = 200;
      ctx.body = { course };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
    console.error('Error fetching course by ID:', error);
  }
}

async function createCourse(ctx) {
  const { name, price, description, userId } = ctx.request.body;
  if (!name || !price || !description || !userId) {
    ctx.status = 400;
    ctx.body = { error: 'Missing required fields' };
    return;
  }

  try {
    const course = await Course.create({ name, price, description, userId });
    ctx.status = 201;
    ctx.body = { course };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
    console.error('Error creating course:', error);
  }
}

async function updateCourse(ctx) {
  const courseId = parseInt(ctx.params.id);
  if (!courseId || courseId < 0) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid course ID' };
    return;
  }

  const { name, price, description, userId } = ctx.request.body;
  if (!name || !price || !description || !userId) {
    ctx.status = 400;
    ctx.body = { error: 'Missing required fields' };
    return;
  }

  try {
    const course = await Course.findByPk(courseId);
    if (!course) {
      ctx.status = 404;
      ctx.body = { error: 'Course not found' };
      return;
    }

    await course.update({ name, price, description, userId });
    ctx.status = 200;
    ctx.body = { course };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
    console.error('Error updating course:', error);
  }
}

async function deleteCourse(ctx) {
  const courseId = parseInt(ctx.params.id);
  if (!courseId || courseId < 0) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid course ID' };
    return;
  }

  try {
    const course = await Course.findByPk(courseId);
    if (!course) {
      ctx.status = 404;
      ctx.body = { error: 'Course not found' };
      return;
    }

    await course.destroy();
    ctx.status = 200;
    ctx.body = { message: 'Course deleted successfully' };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
    console.error('Error deleting course:', error);
  }
}

//Nuevas funciones

async function getCoursesByTeacher(ctx) {
  const teacherId = parseInt(ctx.params.teacherId);
  if (!teacherId || teacherId < 0) {
      ctx.status = 400;
      ctx.body = { error: 'Invalid teacher ID' };
      return;
  }

  try {
      const courses = await Course.findAll({
          where: { userId: teacherId }
      });

      if (!courses.length) {
          ctx.status = 404;
          ctx.body = { error: 'No courses found for this teacher' };
      } else {
          ctx.status = 200;
          ctx.body = { courses };
      }
  } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
      console.error('Error fetching courses by teacher:', error);
  }
}

async function updateCoursePrice(ctx) {
  const courseId = parseInt(ctx.params.id);
  const { newPrice } = ctx.request.body;

  try {
      const course = await Course.findByPk(courseId);
      if (!course) {
          ctx.status = 404;
          ctx.body = { error: 'Course not found' };
          return;
      }

      await course.update({ price: newPrice });
      ctx.status = 200;
      ctx.body = { course };
  } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
      console.error('Error updating course price:', error);
  }
}



module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCoursesByTeacher,
  updateCoursePrice,
};
