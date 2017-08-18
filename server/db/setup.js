var path = require("path"),
mongoose = require("mongoose"),
config = require(path.resolve(__dirname, "..", "config", "config"))

module.exports =function(){
        console.log("About to connect to DB")
          var dbconnection= mongoose.connect(config.LOCAL_DB_NAME, ()=>console.log("Database Connected at ", config.LOCAL_DB_NAME))
          return dbconnection


}
