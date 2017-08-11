var Note = require("../db/models/note"), User = require("../db/models/user"), Dashboard = require("../db/models/dashboard")
module.exports.profile = (req,res)=>{
    //user component server rendring callback logic
      res.render("profile")
}

module.exports.dashboard = (req,res)=>{
  //user component server rendring callback logic
    res.render("profile")
}

module.exports.addpost = (req,res)=>{
  //user component server rendring callback logic
    res.render("profile")
}

module.exports.registerform = (req,res)=>{
  //user component server rendring callback logic
  res.render("authentication")
}
module.exports.loginform = (req,res)=>{
  //user component server rendring callback logic
    res.render("authentication")
}

module.exports.singlenote = (req,res)=>{
    var id = req.params.id
    Note.findOne({_id:id},function(err,found){

            if(err) return err
            if(!found) res.render("Note not found ")
              return res.render("singlenote", {note:found})
          


    })

}
