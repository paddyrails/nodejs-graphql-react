const Event = require('../../models/event');
const User = require('../../models/user');
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


module.exports = {
    events: async () => {
        try{
        const events = await Event.find().populate('creator')
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
    createEvent: (args) => {
        console.log(args.eventInput);
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '5eda9e7442d3ee6c0fac8aca'
        });
        let createdEvent;
        return event
            .save()
            .then((result) => {
                console.log(result);
                createdEvent = { 
                    ...result._doc, 
                    date: new Date(result._doc.date).toISOString(), 
                    creator: user.bind(this, result._doc.creator) };
                return User.findById('5eda9e7442d3ee6c0fac8aca')  
            })
            .then(user => {
                if(!user){
                    throw new Error("user not found");
                }
                console.log(user);
                user.createdEvents.push(event);
                return user.save();
            })
            .then(result => {
                return createdEvent;
            })
            .catch(err => {
                console.log(err);
                throw err;
            })
        
    },
    createUser: (args) => {
        return User.findOne({email: args.userInput.email})
            .then(user => {
                if(user){
                    throw new Error("user already exisits");
                }
                return bcrypt.hash(args.userInput.password, 12)
            }).then(hashedPassword => {
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPassword
                });
                return user.save()
            })
            .then(result => {
                return { ...result._doc, password: null }
            }).catch(err => {
                throw err;
            });
        
    }
}