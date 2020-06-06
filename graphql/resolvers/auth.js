const User = require('../../models/user');
const bcrypt = require('bcryptjs');

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
    }
}