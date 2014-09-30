var bonescript = require('bonescript');
var ejson = require('ejson');
//var DDPClient = require("../lib/ddp-client");
var DDPClient = require('ddp');
var exportedLEDs = ["USR0", "USR1", "USR2", "USR3"];

initializeLEDs = function(){
  for (i=0; i < exportedLEDs.length; i++) {
    bonescript.pinMode(exportedLEDs[i], 'out');
    bonescript.digitalWrite(exportedLEDs[i], 0);
  }
}

var ddpclient = new DDPClient({
  host : "bbblack-meteor-blinky.meteor.com",
  port : 80,
  path : "websocket",
  ssl  : false,
  autoReconnect : true,
  autoReconnectTimer : 500,
  maintainCollections : true,
  ddpVersion : '1'  // ['1', 'pre2', 'pre1'] available
});


//Connect to the Meteor Server
ddpclient.connect(function(error) {
  if (error) {
    console.log('DDP connection error!');
    return;
  }

  console.log('connected!');



  //Subscribe to a Meteor Collection
  ddpclient.subscribe(
    'lights',                  // name of Meteor Publish function to subscribe to
    [],                       // any parameters used by the Publish function
    function () {             // callback when the subscription is complete
      console.log('lights subscription complete');
      //console.log(ddpclient.collections.lights);
      
      initializeLEDs();

      //Make sure each pin we want to control is in the Meteor collection
      //The server checks if the name is already in the collection and will
      //not duplicate it.
      for (i=0; i < exportedLEDs.length; i++) {
        ddpclient.call(
          'addLED',
          [exportedLEDs[i], 'OFF'],
          function (err, result) {   // callback which returns the method call results
            console.log('called addLED, result: ' + result);
          },
          function () {              // callback which fires when server has finished
            console.log('finished addLED call');  // sending any updated documents as a result of
          }
        );
      }
    }
  );
});


//Log all messages if a "changed" message is received change the state of the appropriate pin
ddpclient.on('message', function (msg) {
  console.log("ddp message: " + msg);
  msgParsed = ejson.parse(msg);
  
  if(msgParsed["msg"] === "changed"){
    console.log("Change message for:" + ddpclient.collections.lights[msgParsed["id"]]["name"]);
    if(ddpclient.collections.lights[msgParsed["id"]]["state"] === "OFF"){
      bonescript.digitalWrite(ddpclient.collections.lights[msgParsed["id"]]["name"], 0);
    }else{
      bonescript.digitalWrite(ddpclient.collections.lights[msgParsed["id"]]["name"], 1);
    }
  }

});