import React from 'react';
import './EventsList.css';
import EventItem from '../EventItem/EventItem';

const eventsList = props => {
    const events = props.events.map(event => <EventItem key={event._id} event={event} userId={props.userId}/>)

    return(
        
        <ul className="events__list">
            {events}
        </ul>
    )
}

export default eventsList;