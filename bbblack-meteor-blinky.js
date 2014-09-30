Lights = new Mongo.Collection("lights");

if (Meteor.isClient) {
  Template.LEDs.lights = function () {
    return Lights.find({}, {});
  };
  
  Template.LEDs.events({
      'click button.toggle': function (e) {
        e.preventDefault();
        console.log(e);
        console.log(this);
        if(this["state"] === "OFF"){
          Lights.update(this._id , {$set: {state: "ON"}});
        }else{
          Lights.update(this._id , {$set: {state: "OFF"}});
        }
    }
  })
}


if (Meteor.isServer) {
  Meteor.methods({
    addLED: function(newName, newState){
      if(!Lights.findOne({name: newName})){
        Lights.insert({name: newName, state: newState});
      }
    }
  });
}
