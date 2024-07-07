const mongoose = require('mongoose');
const Salle = require('./salle.model')
const User= require('../models/user.model')


const reservationSchema = mongoose.Schema({
    salle: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Salle', 
        required: true 
    },
    dateDebut: Date,
    dateFin: Date,
}, 
{ 
    timestamps: true 
});


module.exports = mongoose.model('Reservation', reservationSchema);

