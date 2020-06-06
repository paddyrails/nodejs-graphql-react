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
            const result = await event;
            createdEvent = transformEvent(result);
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

    
}