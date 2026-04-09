const express = require('express');
const cors = require('cors');

// Initialize database
require('./database');

const seatRoutes = require('./routes/seatRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/seats', seatRoutes);

app.get('/', (req, res) => {
    res.send('Movie Ticket Booking API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
