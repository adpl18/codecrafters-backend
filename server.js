const app = require('./app');

// Set the port
const PORT = process.env.PORT || 8000;

// Start the server
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = server;
