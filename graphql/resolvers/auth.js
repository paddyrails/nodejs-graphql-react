const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
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
    },

    //login(email: String!, password: String!): AuthData!
    login: async({email, password}) => {
        const user = await User.findOne({email: email})
        if(!user){
            throw new Error("User does not exist!")
        }

        const isEqual = await bcrypt.compare(password, user.password);
        if(!isEqual){
            throw new Error("Password incorrect");
        }
        const token = jwt.sign({userId: user.id, email: user.email}, 'somesupersecretkey', {
            expiresIn: '1h'
        });
        
        return {
            userId: user.id,
            token: token,
            tokenExpiration: 1
        }
    }
}