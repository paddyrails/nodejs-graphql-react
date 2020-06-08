const DataLoader = require('dataloader');

const User = require('../../models/user');
const Event = require('../../models/event');
const { dateToString } = require('../helpers/date');

const eventLoader = new DataLoader((eventIds) => {    
    return events(eventIds);
})

const userLoader = new DataLoader((userIds) => {
    console.log(userIds);
    return User.find({_id: {$in:userIds}});
})

const events = async eventIds => {
    
    try{
       
    const events = await Event.find({_id: {$in: eventIds}})   
    return events;
    // events.map(event => {  
    //     console.log({ 
    //         ...event._doc
    //         //creator: user.bind(this, event._doc.creator)
    //     })
    //     return { 
    //         ...event._doc
    //         //creator: user.bind(this, event._doc.creator)
    //     }
    //     });
    }
    catch(err) {
        console.log(err);
        throw err;
    }
    
}

const user = async userId => {
    try{
    const user = await userLoader.load(userId.toString());//User.findById(userId)
    return { ...user._doc, createdEvents: events.bind(this, user._doc.createdEvents) }// }  //() => eventLoader.loadMany.bind(user._doc.createdEvents)
    }catch(err){
        throw err;
    }
    
}

const singleEvent = async eventId => {
    try{
        const sEvent = await eventLoader.load(eventId.toString());
        console.log("sEvent" + sEvent);
        return sEvent;
    }catch(err){
        throw new Error("could not find " + eventId)
    }
}

const transformEvent = event => {
    return { 
        ...event._doc, 
        date: dateToString(event._doc.date),
        creator:  user.bind(this, event._doc.creator)                   
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