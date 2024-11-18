const app = require('./app'); // Import the app
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5040;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`); // Debugging
});
