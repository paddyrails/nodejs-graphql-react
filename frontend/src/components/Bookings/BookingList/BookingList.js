import React from 'react';
import './BookingList.css';
const bookingList = (props) => (
    <ul className="bookings_list">        
        {props.bookings.map(booking => 
        <React.Fragment key={booking._id}>
            
                <li  className="bookings_item">
                    <div className="bookings_item-data">
                        {booking.event.title} - {booking.createdAt}
                    </div>
                    <div className="bookings_list-actions">
                        <button className="btn" onClick={() => props.cancelBooking(booking._id)}>Cancel</button>
                    </div>
                </li>
            
            
        </React.Fragment>
        )}        
    </ul>
)

export default bookingList;