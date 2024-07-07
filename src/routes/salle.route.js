const express = require('express');

const router = express.Router();

const salleController = require('../controller/salle.controller');

//create a new salle
router.post('/create',salleController.Create)

//get list salle
router.get('/list_salles',salleController.findAll)



module.exports=router