import React from 'react';

const MyBookings = ({ myBookings, onCancelAll }) => {
  // We receive myBookings which is an array of seatIds
  const hasBookings = myBookings && myBookings.length > 0;

  const handleCancelClick = () => {
    if (window.confirm("Are you sure you want to cancel all your booked tickets?")) {
      onCancelAll();
    }
  };

  return (
    <div className="panel" style={{ marginTop: '2rem' }}>
      <div className="panel-header">
        <h2>My Bookings</h2>
      </div>

      <div className="selected-seats-info">
        {!hasBookings ? (
          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>
            You haven't booked any tickets yet.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Your secured seats:
            </p>
            <div className="selected-seats-list">
              {myBookings.map((seatId) => (
                <span key={seatId} className="seat-badge">
                  #{seatId}
                </span>
              ))}
            </div>

            <button 
              className="btn btn-secondary" 
              style={{ marginTop: '0.5rem', borderColor: 'var(--seat-booked)', color: 'var(--seat-booked)' }}
              onClick={handleCancelClick}
            >
              Cancel Tickets
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
