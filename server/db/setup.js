var path = require("path"),
mongoose = require("mongoose"),
config = require(path.resolve(__dirname, "..", "config", "config"))

module.exports =  ()=>{
          var dbconnection= mongoose.connect(config.DB_NAME, ()=>console.log("Database Connected at ", config.DB_NAME))
          return dbconnection
}
