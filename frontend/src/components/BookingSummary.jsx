import React from 'react';
import { Ticket, X } from 'lucide-react';

const TICKET_PRICE = 15; // Set ticket price to 15 for demo purposes

const BookingSummary = ({ selectedSeats, onBook, onCancelSelection }) => {
  const isSelectionEmpty = selectedSeats.length === 0;
  const totalPrice = selectedSeats.length * TICKET_PRICE;

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Booking Summary</h2>
      </div>

      <div className="selected-seats-info">
        <p style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          Selected Seats ({selectedSeats.length})
        </p>
        
        {isSelectionEmpty ? (
          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>
            No seats selected
          </p>
        ) : (
          <div className="selected-seats-list">
            {selectedSeats.map((seatId) => (
              <span key={seatId} className="seat-badge">
                #{seatId}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="total-section">
        <span style={{ color: 'var(--text-muted)' }}>Total Amount</span>
        <span>${totalPrice}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        <button 
          className="btn btn-primary" 
          disabled={isSelectionEmpty}
          onClick={onBook}
        >
          <Ticket size={20} />
          Book Tickets
        </button>
        
        <button 
          className="btn btn-secondary" 
          disabled={isSelectionEmpty}
          onClick={onCancelSelection}
        >
          <X size={20} />
          Clear Selection
        </button>
      </div>
    </div>
  );
};

export default BookingSummary;
