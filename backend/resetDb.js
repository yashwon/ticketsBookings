const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Resetting the database...');

db.serialize(() => {
  db.run(`UPDATE seats SET status = 'available', booking_id = NULL`, function(err) {
    if (err) {
      console.error('Error resetting seats:', err.message);
    } else {
      console.log(`Database reset successfully. Modified ${this.changes} rows.`);
    }
    db.close();
  });
});
