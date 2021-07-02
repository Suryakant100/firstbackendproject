const mongoose = require('mongoose');
const bcript = require('bcryptjs');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    repeatePass: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})
// genwrating token

userSchema.methods.generatingToken = async function () {
    try {
        console.log(this._id);
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
        console.log(token);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (error) {
        res.send("error");

    }
}


// pasword hashing

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        // console.log(`this current password is ${this.password}`);
        this.password = await bcript.hash(this.password, 10);
        // console.log(`this current password is ${this.password}`);

        this.repeatePass =  await bcript.hash(this.password, 10);
    }

    next();
})




const Register = new mongoose.model("Register", userSchema);

module.exports = Register;