const User = require('../../models/user');
const Event = require('../../models/event');
const { transformEvent } = require('./merge')


module.exports = {
    events: async () => {
        try{
        const events = await Event.find()
        return events.map(event => {
                return transformEvent(event);
            });
        }catch(err){
            throw err;
        }
    },

    createEvent: async (args, req) => {
        if(!req.isAuth){
            throw new Error("Unuathenticated!")
        }
        try{
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: req.userId
            });
            let createdEvent;
            const result = await event.save();
            createdEvent = transformEvent(result);
            const user1 = await User.findById(req.userId)  
        
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

    
}