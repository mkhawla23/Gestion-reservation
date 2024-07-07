const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Salle = require('../models/salle.model');
const Reservation = require('../models/reservation.model');
const User = require('../models/user.model');

const router = express.Router();

// Middleware pour vérifier le token JWT
const isAuthenticated = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }
    try {
        const decoded = jwt.verify(token, 'nodejsexpress');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send('Invalid token.');
    }
};

// Route pour créer une réservation
router.post('/create_reservation', isAuthenticated, async (req, res) => {
    const { salleId, dateDebut, dateFin } = req.body;
   

    try {
        const salle = await Salle.findById(salleId);
        if (!salle) {
            return res.status(404).send('Room not found.');
        }

        const reservations = await Reservation.find({
            salle: salleId,
            $or: [
                { dateDebut: { $lt: dateFin, $gte: dateDebut } },
                { dateFin: { $gt: dateDebut, $lte: dateFin } },
                { dateDebut: { $lte: dateDebut }, dateFin: { $gte: dateFin } }
            ]
        });

        if (reservations.length > 0) {
            return res.status(400).send('Room already reserved for this time slotHHHHHHHHHHHHHHH.');
        }

        const newReservation = new Reservation({
            salle: salleId,
            dateDebut,
            dateFin
        });

        await newReservation.save();
        res.status(201).send('Reservation created successfully.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
});


// Route pour obtenir les réservations d'un utilisateur
router.get('/list_reservations', isAuthenticated, async (req, res) => {
    const userId = req.user.userId;

    try {
        var reservations = await Reservation.find({ user: userId }).populate('salle');
        res.status(200).json(reservations);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
});




// Route pour update une réservation
router.put('/update_reservation/:id', isAuthenticated, async (req, res) => {
    const reservationId = req.params.id;
    const { salleId, dateDebut, dateFin } = req.body;
   

    try {
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).send('Reservation not found.');
        }

        const salle = await Salle.findById(salleId);
        if (!salle) {
            return res.status(404).send('Room not found.');
        }

      
        const reserv = await Reservation.find({
            salle: salleId,
            _id: { $ne: reservationId }, 
            $or: [
                { dateDebut: { $lt: dateFin, $gte: dateDebut } },
                { dateFin: { $gt: dateDebut, $lte: dateFin } },
                { dateDebut: { $lte: dateDebut }, dateFin: { $gte: dateFin } }
            ]
        });

       
        console.log('dateDebut:', dateDebut);
        console.log('dateFin:', dateFin);
        console.log('reserv:', reserv);
        console.log('number of reserv:', reserv.length);

        if (reserv.length > 0) {
            return res.status(400).send('Room already reserved for this time slot FFFFFFFFFFFFFF.');
        }

       
        reservation.salle = salleId;
        reservation.dateDebut = dateDebut;
        reservation.dateFin = dateFin;
        

        await reservation.save();
        res.status(200).send('Reservation updated successfully.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
});



//route pour aanuler la reservation
router.delete('/annuler_reservation/:id', isAuthenticated, async (req, res) => {
    const reservationId = req.params.id;

    try {
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).send('Reservation not found.');
        }

        await Reservation.deleteOne({ _id: reservationId }); 
        res.status(200).send('Reservation canceled successfully.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
});





// Route pour afficher les calendrier des reservation 
router.get('/reservations_calendar', isAuthenticated, async (req, res) => {
    try {
      
        const salles = await Salle.find();

        const reservationsParSalle = {};

        for (const salle of salles) {
            const reservations = await Reservation.find({ salle: salle._id });
            reservationsParSalle[salle.nameSalle] = reservations;
        }

        res.status(200).json(reservationsParSalle);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
});


module.exports = router;
