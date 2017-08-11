var User = require("../db/models/user"),
Dashboard = require("../db/models/dashboard"),
Note = require("../db/models/note"),
 errorHandler = (res,error)=>{ res.send({error}) },
jwt = require('jsonwebtoken'),
config = require("../config/config"),
 tokenForUser = (user)=>{return jwt.sign({ payload:user._id ,  iat:new Date().now},config.SECRET );}


module.exports.home = (req,res)=>{
    //get all public notes first
    Note.find({public_status:true}, function(error, foundNotes){

            if(error) return error
            if(!foundNotes)  res.render("home", {AppName:"Note Application"});
            else  res.render("home", {AppName:"Note Application", notes:foundNotes});
            res.end()
    })


  }

module.exports.authentication = function(req,res){res.render("authentication")}

module.exports.logout = (req,res,next)=>{res.render("logout").end()}

module.exports.singlenote = (req,res)=>{
  var id = req.params.id
  res.render("singlenote", {id:id})
}

module.exports.profiletemplate = (req,res)=>{res.render("profile")}

module.exports.userDashboard = (req,res)=>{
//get user dashboard
var currentUser = req.user
Dashboard.findOne({userID:currentUser._id}, function(error, foundDashboard){
      if(error) return next(error)
      if(!foundDashboard) return errorHandler(res, "User has no Profile")
      return res.send({dashboard:foundDashboard})
})

}
module.exports.userProfile = (req,res)=>{

  var currentUser = req.user
  Dashboard.findOne({userID:currentUser._id}, function(error, foundDashboard){
        if(error) return next(error)
        if(!foundDashboard) return errorHandler(res, "User has no Profile")
        var profile = {
          full_name: foundDashboard.full_name,
          profileImageURL:foundDashboard.profileImageURL,
          background_color:foundDashboard.background_color
        }
        res.send({profile})
        return
  })
}
module.exports.register = (req,res,next)=>{
//register user; send user token
if("user" in req.body == false) return errorHandler(res,"Send actual data")
var newuser = req.body.user
    if("password" in newuser == false || "email" in newuser == false) return errorHandler(res,"New User is invalid")
User.findOne({email:newuser.email}, function(err, found){
        if(err) return next(err)
        if(found) return errorHandler(res, "User is already registered")
        var user = new User(newuser)
        user.save((error)=>{
              if(error) return errorHandler(error)
              //create a dashboard for user
                var dashboard  = new Dashboard()
                dashboard.userID =  user._id
                dashboard.save(function(err){
                  if(error) return errorHandler(error)
                //  console.log(dashboard)
                  return res.json({token:tokenForUser(user)})
                })

        })
})

}
module.exports.login =  function(req,res){
  var data = req.user
  if(data.error)
    return res.send({error:data.error})
  return res.send({token:tokenForUser(data.user)})
}
module.exports.userinvalid = (req,res)=> errorHandler(res, "user invalid");
module.exports.delete = (req,res)=>{
//delete user and redirect to home
User.find(req.body.id, function(err, foundUser){
    if(err) return err
    if(!foundUser) return errorHandler(res,"User does not exist")
    if(foundUser._id !== req.user._id) return errorHandler(res, "Current User cannot delete other users")
    Note.find({author:req.user._id}).remove(function(err){
        if(err) return err
        Dashboard.findOne({userID:req.user._id}).remove(function(err){
            if(err) return err
                User.findOne(foundUser._id).remove(function(err){
                    if(err) return err
                    return res.json({success:true}).end()
                })
        })
    })

})
}
module.exports.newnote = (req,res)=>{
//creates new note
  var newnote = req.body
  //validation
  if("title" in newnote &&  newnote.title.length > 0  && "content" in newnote && newnote.content.length > 0){
        var note  = new Note(newnote)
        note.author = req.user._id
        note.date = new Date()
        note.last_update = new Date()
        //get user name
        Dashboard.findOne({userID:req.user._id}, function(error, user){
            if(error) return error
            if(user){
              note.authorName = user.full_name
            }
            //save new note
            note.save(function(err){
                if(err) return err
                res.json(note).end()
            })
        })

  }else return errorHandler(res, "Valid Input is required")
}
var NotePermission = (noteID, currentUser, done)=>{

  if(!noteID) done({error:"Please send Note ID"})
  Note.findOne({_id:noteID}, function(err, note){
          if(err) return done(err,null)
          if(!note) return done(null,false)
          //if note exists, compare author to  current user
          if(currentUser.equals(note.author)) return done(null,true,true, note)
          else return done(null, true, false, note)

  })
}
module.exports.deleteNote = (req,res)=>{
  //delete Note and update front end
  var noteID = req.body.id
  return NotePermission(noteID, req.user._id, function(err, exist, allowed, foundNote){

          if(err) return res.send({error:err})
          if(!exist) return res.json({error:"Note does not exist. Send valid ID"})
          if(!allowed) return errorHandler(res, "You are not allowed to delete this note! stop being petty!")
          Note.remove({_id:foundNote._id}, function(err){
              if(err) return err
              return res.json({success:true}).end()
          })
  })

}

module.exports.updateNote = (req,res)=>{
//update note

var noteUpdate = req.body
return NotePermission(noteUpdate._id, req.user._id, function(err, exist, allowed, foundNote){
      if(err) return err
      if(!exist)  return res.json({error:"Note does not exist. Send valid ID"})
      if(!allowed) return errorHandler(res, "You are not allowed to update this note! stop being petty!")

      foundNote.title = noteUpdate.title || foundNote.title
      foundNote.content = noteUpdate.content || foundNote.content
      foundNote.public_status = noteUpdate.public_status
      foundNote.last_update = noteUpdate.last_update || foundNote.last_update

      Dashboard.findOne({userID:req.user._id}, function(error, user){
          if(error) return error
          if(user){

            foundNote.authorName = user.full_name
          }
          //save new note
          foundNote.save(function(err){
              if(err) return err
              return res.json({success:true,note:foundNote}).end()
          })
      })


})
}

module.exports.updatedashboard = (req,res)=>{
  //update dashboard
  var userID = req.user._id
  Dashboard.findOne({userID}, function(err, foundDashboard){
          if(err) return err;
          if(!foundDashboard){
              //create new dashboard for user
              var newDashboard = new Dashboard(req.body)
              newDashboard.save(function(err){
                      if(err) return err
                      return res.json({success:true, dashbaord:newDashboard})
              })
          }else{
              //update if dashbaord does not exist
              foundDashboard.first_name = req.body.first_name || foundDashboard.first_name
              foundDashboard.last_name = req.body.last_name || foundDashboard.last_name
              foundDashboard.background_color = req.body.background_color || foundDashboard.background_color
              //foundDashboard.update_times_in_month = foundDashboard.update_times_in_month+ 1
              foundDashboard.public_status = req.body.public_status || foundDashboard.public_status
              foundDashboard.profileImageURL = req.body.profileImageURL ||foundDashboard.profileImageURL
              foundDashboard.birthday = req.body.birthday || foundDashboard.birthday
              foundDashboard.sex = req.body.sex || foundDashboard.sex


              foundDashboard.save(function(err){
                  if(err) return err
                  return res.json({success:true,  dashboard:foundDashboard})
              })
          }
  })

}



module.exports.usernotes = function(req,res){

        var user = req.user

        Note.find({author:user._id}, function(err, foundNotes){

                if(err) return err
                if(!foundNotes) return res.json({notes:null})
                return res.json({notes:foundNotes})
        })
}

module.exports.publicnotes = function(req,res){

          Note.find({public_status:true}, function(err, foundNotes){
                if(err) return err
                if(!foundNotes) return res.json({notes:null, error:"No public notes available"})
                return res.json({notes:foundNotes})
          })
}

module.exports.getsinglenote = function(req,res){
  var id = req.params.id
  Note.find(id, function(err, foundNote){
          if(err) return err
          if(!foundNote || foundNote.length <= 0) return res.json({note:null,error:"note does not exist"})
        return res.json({note:foundNote})

  })
}


module.exports.GRUI = function(req,res){
  var id = req.user._id;
  res.json({userID:id});
  return
}
