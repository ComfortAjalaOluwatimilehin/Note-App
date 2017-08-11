
var callback = require("./callback"), reactComponent = require("./react-component-server"), passport = require("passport")
require("../services/passport");
var loginAuth = passport.authenticate("local", {failureRedirect:"/userinvalid", session: false}),
 tokenAuth = passport.authenticate("jwt", {failureRedirect:"/userinvalid", session: false})
module.exports = (app)=>{

        //Basic Routing--> rendering views not components
        app.get("/", callback.home) //sends the user the home page
        app.get("/home",callback.home)
        //app.get("/authentication", callback.authentication) //sends the user the authentication page; login, register
        app.get("/logout",  callback.logout) //renders the logout page
        app.get("/singlenote/:id", callback.singlenote) //renders the single post page
        app.get("/single/:id", callback.singlenote)
        app.get("/getsinglenote/:id", callback.getsinglenote)
        app.get("/user", tokenAuth, callback.profiletemplate) //profile, dashboard,addpost
        app.get("/getreadinguserid", tokenAuth, callback.GRUI)
        //component render
        app.get("/profile", reactComponent.profile)
        app.get("/dashboard", reactComponent.dashboard)
        app.get("/addnote", reactComponent.addpost)
        app.get("/registerform", reactComponent.registerform)
        app.get("/loginform", reactComponent.loginform)
        app.get("/note/:id", reactComponent.singlenote)
        //Data Routing -> API
        app.get("/user-dashboard",tokenAuth,callback.userDashboard) //gives user his/her dashboard
        app.get("/user-notes", tokenAuth, callback.usernotes)
        app.get("/user-profile", tokenAuth, callback.userProfile)
        app.get("/public_notes", callback.publicnotes)
        //POST Routing
        app.post("/register", callback.register) //authenticates user
        app.post("/login",loginAuth, callback.login) //authenticates user
        app.get("/userinvalid",callback.userinvalid)
        app.post("/delete", tokenAuth, callback.delete)
        app.post("/newnote", tokenAuth, callback.newnote)
        app.post("/deletenote",tokenAuth, callback.deleteNote)
        app.post("/updatenote",tokenAuth, callback.updateNote)
        app.post("/updatedashboard", tokenAuth, callback.updatedashboard)

}
