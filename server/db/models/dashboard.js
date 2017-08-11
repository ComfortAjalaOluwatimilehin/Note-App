var mongoose = require("mongoose"),
schema = mongoose.Schema




var Dashboard = new schema({
      userID:{type:Object, unique:true},
      registeration_date:{type:Date},
      full_name:{type:String, default:""},
      last_name:{type:String, default:""},
      first_name:{type:String, default:""},
      update_times_in_month:{type:Number, default:0},
      background_color:{type:String, default:""},
      public_status:{type:Boolean, default:false},
      profileImageURL:{type:String, default:""},
      birthday:{type:String},
      role:Object,
      sex:{type:String, default:""}
})

Dashboard.pre("save", function(next){
  //var current = this
  this.registeration_date = new Date().now
  this.full_name = this.first_name + " " + this.last_name
  this.update_times_in_month = this.update_times_in_month + 1
  this.role = true
  console.log("saving document")
  return next()
})
/*Dashboard.pre("update", function(){
  console.log("updating document")
  var updatevalue = this.update_times_in_month + 1;
    this.update({}, {$set:{update_times_in_month:updatevalue}})
    return
})
*/
module.exports = mongoose.model("Dashboard", Dashboard)
