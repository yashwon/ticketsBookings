const express = require('express');
const router = express.Router();
const db = require('../database');
const { v4: uuidv4 } = require('uuid');

// Get all seats
router.get('/', (req, res) => {
    db.all('SELECT * FROM seats', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ seats: rows });
    });
});

// Book one or multiple seats
router.post('/book', (req, res) => {
    const { seatIds } = req.body;

    if (!seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
        return res.status(400).json({ error: 'Please provide an array of seatIds to book.' });
    }

    db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        const placeholders = seatIds.map(() => '?').join(',');
        const query = `SELECT * FROM seats WHERE seat_id IN (${placeholders})`;

        db.all(query, seatIds, (err, rows) => {
            if (err) {
                db.run('ROLLBACK');
                return res.status(500).json({ error: 'Database error while fetching seats.' });
            }

            if (rows.length !== seatIds.length) {
                db.run('ROLLBACK');
                return res.status(400).json({ error: 'One or more invalid seat IDs provided.' });
            }

            const alreadyBooked = rows.filter(r => r.status === 'booked');
            if (alreadyBooked.length > 0) {
                db.run('ROLLBACK');
                return res.status(400).json({ 
                    error: 'Some of the selected seats are already booked.',
                    conflictSeats: alreadyBooked.map(r => r.seat_id)
                });
            }

            // All clear to book
            const bookingId = uuidv4();
            const updateQuery = `UPDATE seats SET status = 'booked', booking_id = ? WHERE seat_id IN (${placeholders})`;
            
            db.run(updateQuery, [bookingId, ...seatIds], function(err) {
                if (err) {
                    db.run('ROLLBACK');
                    return res.status(500).json({ error: 'Could not book seats.' });
                }
                
                db.run('COMMIT', (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to commit booking.' });
                    }
                    res.json({ message: 'Booking successful', bookingId, seatIds });
                });
            });
        });
    });
});

// Cancel a booking by seat IDs
router.post('/cancel', (req, res) => {
    const { seatIds } = req.body;

    if (!seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
        return res.status(400).json({ error: 'Please provide seatIds to cancel.' });
    }

    const placeholders = seatIds.map(() => '?').join(',');
    const updateQuery = `UPDATE seats SET status = 'available', booking_id = NULL WHERE seat_id IN (${placeholders})`;

    db.run(updateQuery, seatIds, function(err) {
        if (err) {
            return res.status(500).json({ error: 'Could not cancel booking.' });
        }
        res.json({ message: 'Cancellation successful', updatedSeats: this.changes });
    });
});

module.exports = router;
