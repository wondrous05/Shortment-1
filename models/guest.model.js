const mongoose = require('mongoose');


const  guestSchema = new mongoose.Schema ({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    location: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    beds: {
        type: String,
        required: true
    },

    nationalid: {
        type: String,

        
    },

    driverlicense: {
        type: String,
        
    },

    passport: {
        type: String,
        
    },

    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },

    checkin: {
        type: Boolean,
        required: true
    },

    checkout: {
        type: Boolean,
        required: true
    },

    history: {
        type: [String],
        required: true
    }

});

const guest = mongoose.model('guest', guestSchema);
module.exports = guest;