const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});

userSchema.methods.saveUser = function() {
    return this.save();
};

userSchema.statics.findByUsername = function(username) {
    return this.findOne({ username });
};

const User = mongoose.model('User', userSchema);

module.exports = User;