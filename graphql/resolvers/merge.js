const User = require('../../models/user');
const Event = require('../../models/event');
const { dateToString } = require('../helpers/date');

const events = async eventIds => {
    
    try{
    const events = await Event.find({_id: {$in: eventIds}})        
    events.map(event => {        
        return { 
            ...event._doc,
            creator: user.bind(this, event._doc.creator)
        }
        });
    }
    catch(err) {
        throw err;
    }
    
}

const user = async userId => {
    try{
    const user = await User.findById(userId)
    return { ...user._doc, createdEvents: events.bind(this, user._doc.createdEvents) }
    }catch(err){
        throw err;
    }
    
}

const singleEvent = async eventId => {
    try{
        const sEvent = await Event.findById(eventId)
        return { ...sEvent._doc }
    }catch(err){
        throw new Error("could not find " + eventId)
    }
}

const transformEvent = event => {
    return { 
        ...event._doc, 
        date: dateToString(event._doc.date),
        creator: user.bind(this, event._doc.creator)                   
    }
}

const transformBooking = booking => {
    return { 
        ...booking._doc, 
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt),   
        event: singleEvent.bind(this, booking._doc.event),
        user: user.bind(this, booking._doc.user)                        
    }
}

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;