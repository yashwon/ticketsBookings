import React from 'react';

const SeatGrid = ({ seats, selectedSeats, onSeatClick }) => {
  return (
    <div className="seat-container">
      <div className="legend">
        <div className="legend-item">
          <div className="legend-color available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-color selected"></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-color booked"></div>
          <span>Booked</span>
        </div>
      </div>

      <div className="seat-grid">
        {seats.map((seat) => {
          const isSelected = selectedSeats.includes(seat.seat_id);
          const isBooked = seat.status === 'booked';
          let className = 'seat';
          if (isSelected) className += ' selected';
          if (isBooked) className += ' booked';
          if (!isSelected && !isBooked) className += ' available';

          return (
            <div
              key={seat.seat_id}
              className={className}
              onClick={() => onSeatClick(seat.seat_id)}
            >
              <span>{seat.seat_id}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SeatGrid;
