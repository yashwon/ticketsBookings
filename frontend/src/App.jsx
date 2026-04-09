import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, CheckCircle } from 'lucide-react';
import SeatGrid from './components/SeatGrid';
import BookingSummary from './components/BookingSummary';
import MyBookings from './components/MyBookings';
import './index.css';

const API_BASE_URL = 'http://localhost:5000/api/seats';

function App() {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [toast, setToast] = useState(null);
  const [myBookings, setMyBookings] = useState(() => {
    const saved = localStorage.getItem('cineflex_my_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cineflex_my_bookings', JSON.stringify(myBookings));
  }, [myBookings]);

  // Fetch all seats on mount
  const fetchSeats = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setSeats(response.data.seats);
    } catch (error) {
      showToast('error', 'Failed to fetch seats. Is the backend running?');
    }
  };

  useEffect(() => {
    fetchSeats();
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSeatClick = (seatId) => {
    const seat = seats.find(s => s.seat_id === seatId);
    if (!seat || seat.status === 'booked') return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(prev => prev.filter(id => id !== seatId));
    } else {
      setSelectedSeats(prev => [...prev, seatId]);
    }
  };

  const handleBook = async () => {
    if (selectedSeats.length === 0) return;

    try {
      await axios.post(`${API_BASE_URL}/book`, { seatIds: selectedSeats });
      showToast('success', 'Tickets booked successfully!');
      setMyBookings(prev => [...prev, ...selectedSeats]);
      setSelectedSeats([]);
      fetchSeats(); // Refresh seats after booking
    } catch (error) {
      const errMsg = error.response?.data?.error || 'Failed to book tickets.';
      showToast('error', errMsg);
      fetchSeats(); // Refresh in case there was a concurrency issue
    }
  };

  const handleCancelSelection = () => {
    setSelectedSeats([]);
  };

  const handleCancelAllBookings = async () => {
    if (myBookings.length === 0) return;
    try {
      await axios.post(`${API_BASE_URL}/cancel`, { seatIds: myBookings });
      showToast('success', 'All your tickets have been cancelled.');
      setMyBookings([]);
      fetchSeats(); // Refresh seats after cancellation
    } catch (error) {
      const errMsg = error.response?.data?.error || 'Failed to cancel tickets.';
      showToast('error', errMsg);
      fetchSeats(); // Refresh in case there was a concurrency issue
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>CineFlex Pro</h1>
        <p>Experience movies like never before.</p>
      </header>

      <main className="booking-layout">
        <section className="seat-section">
          {/* Cinema Screen Mockup */}
          <div className="cinema-screen-container">
            <div className="screen"></div>
            <span className="screen-text">Cinema Screen</span>
          </div>

          <SeatGrid 
            seats={seats} 
            selectedSeats={selectedSeats} 
            onSeatClick={handleSeatClick} 
          />
        </section>

        <aside className="summary-section">
          <BookingSummary 
            selectedSeats={selectedSeats}
            onBook={handleBook}
            onCancelSelection={handleCancelSelection}
          />
          <MyBookings 
            myBookings={myBookings}
            onCancelAll={handleCancelAllBookings}
          />
        </aside>
      </main>

      {/* Toast Notification */}
      {toast && (
        <div className={`toast-message ${toast.type}`}>
          {toast.type === 'error' ? <AlertCircle size={24} /> : <CheckCircle size={24} />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

export default App;
