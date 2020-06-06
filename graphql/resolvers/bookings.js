const Booking = require('../../models/booking');
const Event = require('../../models/event');
const { transformBooking } = require('./merge')

module.exports = {

    bookings: async () => {
        try{
        const bookings = await Booking.find()
        return bookings.map(booking => {            
                return transformBooking(booking)
            });
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
        return transformBooking(result);
    },

    //cancelBooking(bookingId: ID!): Event!
    cancelBooking: async args => {
        try{
            const fetchedBooking = await Booking.findById({_id: args.bookingId}).populate('event');
            if(!fetchedBooking){
                throw new Error("Booking does not exist")
            }
            const event = transformEvent(fetchedBooking.event)
            await Booking.deleteOne({_id:args.bookingId})                
            return event;
        }catch(err){
            throw err;
        }
    }
}