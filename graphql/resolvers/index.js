const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');
const bcrypt = require('bcryptjs');

const events = async eventIds => {
    try{
    const events = await Event.find({_id: {$in: eventIds}})        
    events.map(event => {
        return { 
            ...event._doc,
            creator: user.bind(this, event.creator)
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

module.exports = {
    events: async () => {
        try{
        const events = await Event.find()
        return events.map(event => {
                return { 
                    ...event._doc, 
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event._doc.creator)                   
                }
            });
        }catch(err){
            throw err;
        }
    },
    bookings: async () => {
        try{
        const bookings = await Booking.find()
        return bookings.map(booking => {
                return { 
                    ...booking._doc, 
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.createdAt).toISOString(),   
                    event: singleEvent.bind(this, booking._doc.event),
                    user: user.bind(this, booking._doc.user)                        
                }
            });
        }catch(err){
            throw err;
        }
    },
    createEvent: async (args) => {
        try{
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '5eda9e7442d3ee6c0fac8aca'
            });
            let createdEvent;
            const result = await event    
            createdEvent = { 
                ...result._doc, 
                date: new Date(result._doc.date).toISOString(), 
                creator: user.bind(this, result._doc.creator) };
            const user1 = await User.findById('5eda9e7442d3ee6c0fac8aca')  
        
            if(!user1){
                throw new Error("user not found");
            }        
            user1.createdEvents.push(event);
            await user1.save();        
            return createdEvent;
            
        }catch(err){
            throw err;
        }        
    },

    bookEvent: async args => {
        const fetchedEvent = await Event.findOne({_id: args.eventId});
        const booking = new Booking({
            user: '5eda9e7442d3ee6c0fac8aca',
            event: fetchedEvent
        });
        const result = await booking.save();
        return {
            ...result._doc,
            createdAt: new Date(result._doc.createdAt).toISOString(),
            updatedAt: new Date(result._doc.createdAt).toISOString(),  
        }
    },

    createUser: async(args) => {
        try{
            const dupUser = await User.findOne({email: args.userInput.email})            
            if(dupUser){
                throw new Error("user already exisits");
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
                
            const newUser = new User({
                        email: args.userInput.email,
                        password: hashedPassword
                    });
            await newUser.save()
            return { ...newUser._doc, password: null };
        }catch(err){
            throw err;
        }
    }
}