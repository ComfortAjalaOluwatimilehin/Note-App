var express = require("express"),
app = express(),
bodyParser = require("body-parser"),
passport = require("passport"),
path = require("path"),
morgan = require("morgan")
//setup database connections
var databaseConnection = require("./db/setup")()
//setup environment
process.env.PROD_DEV = true //if true --> prod; else DEV
var PROD = false;
if(PROD == false){
  app.use(morgan("combined"))
}
  app.set("port", process.env.PORT || 3000)
  app.set('view engine', 'ejs')
  app.set('views', path.resolve(__dirname, "../public/views"))


  app.use(express.static(path.resolve(__dirname, "../public")));
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(bodyParser.json());
  app.use(passport.initialize());




  require("./routes/routes")(app)




exports.app = app;
exports.db = databaseConnection
