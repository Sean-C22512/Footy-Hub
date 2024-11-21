// This file is responsible for starting the server using the app defined in app.js.
const app = require('./app'); // Import the app
const dotenv = require('dotenv');

dotenv.config();

//The server will use the PORT variable from .env
// If PORT is not defined in .env, it defaults to 5040.
const PORT = process.env.PORT || 5040;

//This starts the server and listens for incoming HTTP requests on the specified PORT
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`); // Debugging
});
