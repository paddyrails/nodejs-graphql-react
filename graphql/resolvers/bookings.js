const Booking = require('../../models/booking');
const Event = require('../../models/event');
const { transformBooking, transformEvent } = require('./merge')

module.exports = {

    bookings: async (args, req) => {
        if(!req.isAuth){
            throw new Error("Unauthenticated!")
        }
        try{
        const bookings = await Booking.find({user: req.userId}) //
        return bookings.map(booking => {            
                return transformBooking(booking)
            });
        }catch(err){
            throw err;
        }
    },
    
    bookEvent: async (args, req) => {
        if(!req.isAuth){
            throw new Error("Unauthenticated!")
        }
        const fetchedEvent = await Event.findOne({_id: args.eventId});
        const booking = new Booking({
            user: req.userId,
            event: fetchedEvent
        });
        const result = await booking.save();
        return transformBooking(result);
    },

    //cancelBooking(bookingId: ID!): Event!
    cancelBooking: async (args, req)=> {
        if(!req.isAuth){
            throw new Error("Unauthenticated!")
        }
        try{
            const fetchedBooking = await Booking.findById({_id: args.bookingId}).populate('event');
            if(!fetchedBooking){
                throw new Error("Booking does not exist")
            }
            console.log("fetchedBooking.user" + fetchedBooking.user)
            console.log("req.userId" + req.userId)
            if(fetchedBooking.user.toString() !== req.userId.toString()){
                throw new Error("Can cancel only user's own bookings")
            }
            const event = transformEvent(fetchedBooking.event)
            await Booking.deleteOne({_id:args.bookingId})                
            return event;
        }catch(err){
            throw err;
        }
    }
}