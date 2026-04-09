const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

function initDb() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS seats (
            seat_id INTEGER PRIMARY KEY,
            status TEXT NOT NULL DEFAULT 'available',
            booking_id TEXT
        )`, (err) => {
            if (err) {
                console.error('Error creating seats table:', err.message);
            } else {
                console.log('Seats table is ready.');
                seedSeats();
            }
        });
    });
}

function seedSeats() {
    db.get('SELECT COUNT(*) as count FROM seats', (err, row) => {
        if (err) {
            console.error('Error counting seats:', err.message);
            return;
        }

        if (row.count === 0) {
            console.log('Seeding 20 seats...');
            const stmt = db.prepare('INSERT INTO seats (seat_id, status) VALUES (?, ?)');
            for (let i = 1; i <= 20; i++) {
                stmt.run(i, 'available');
            }
            stmt.finalize(() => {
                console.log('Seeded 20 seats.');
            });
        }
    });
}

module.exports = db;
