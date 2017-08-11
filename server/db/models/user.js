var mongoose = require("mongoose"),
bcrypt = require("bcrypt-nodejs"),
schema = mongoose.Schema



var User = new schema({
    email:{unique:true, type:String},
    password:String
})

User.pre("save", function(next){
  var user = this
  bcrypt.genSalt(13, function(error,salt){
        if(error) return next(error)
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            // Store hash in your password DB.
            if(err) return next(err)
            //save user
            user.password = hash
            next()
        });
  })
})

User.methods.comparePassword = function(password, callback){
        var user_pass =this.password
        bcrypt.compare(password, user_pass,function(err, isMatch){
            if(err) return callback(err,null)
            if(isMatch) return callback(null, true)
            else return callback("Password does not match", false)
        })


}

module.exports = mongoose.model("user", User)
