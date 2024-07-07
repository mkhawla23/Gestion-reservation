const mongoose= require('mongoose')
const bcrypt= require('bcryptjs')

const userSchema= new mongoose.Schema(
    {
        username:{type:String,unique:true},
        password:String,
    }
    , { timestamps: true }
)
userSchema.pre('save',async function(next){
    const user= this;
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,10)
    }
})
const user = mongoose.model('User',userSchema)
module.exports = user