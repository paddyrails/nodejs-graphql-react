import React from 'react';
import './EventDetails.css';

const eventDetails = props => {
    
    return(
        <div className="event__details">
        <h1>{props.event.title}</h1>
        <h2>{props.event.price} - {props.event.date}</h2>
        <p>{props.event.description}</p>
        </div>
    )
}

export default eventDetails;