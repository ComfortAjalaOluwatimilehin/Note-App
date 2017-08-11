var mongoose = require("mongoose"), schema = mongoose.Schema



var Note = new schema({

      author:{type:Object},
      related_notes:{type:Array},
      date:{type:Date},
      last_update:{type:Date},
      title:String,
      content:String,
      public_status:Boolean,
      authorName:{type:String, default:"Anonymous"}
})



module.exports = mongoose.model("note", Note)
