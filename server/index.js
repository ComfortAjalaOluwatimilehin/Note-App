

var setup = require("./setup"), server = setup.app, db = setup.db
server.listen(server.get("port"), ()=>{
    console.log("server is running at port ", server.get("port"));
})
