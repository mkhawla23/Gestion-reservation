const Salle=require('../models/salle.model');



//fonction de cree et enregistrer une salle
exports.Create= (req,res) => {
    //validate request
    if(!req.body){
        return res.status(400).send({
            message : "please complete all field "
        });
    
    }
//create new salle
const salle = new Salle({
    nameSalle: req.body.nameSalle,
    capacite: req.body.capacite,
    equipement: req.body.equipement,
});

//save user bd
salle.save().then(data=>{res.send(data)}).catch(err=>{
    res.status(500).send({message:err.message || "something went wrong while creating new meeting room"})
})


};





//find salles
exports.findAll= (req, res)=>{
    Salle.find().then(salles=>{
        res.send(salles);

    }).
    catch(err=>
        {
            res.status(500).send({message:"somthing wrongwhile getting list of meeting room!!!!!!!!"})
        }
    )
    
}