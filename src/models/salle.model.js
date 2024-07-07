const mongoose=require('mongoose');

const salleSchema= mongoose.Schema({
    nameSalle: {type:String,unique:true},
    capacite: Number,
    equipement : [String],
  
},
{timestamps:true}
)

module.exports=mongoose.model('Salle',salleSchema);