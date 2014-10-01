#bbblack-meteor-blinky

This is a small example of how Meteor could be used for an Internet of Things application.  In this example, Meteor provides the front-end interface and the back-end server while the device runs node.js and subscribes to the Meteor collection using DDP.

Special thanks to the oortcloud folks as this was inspired and made easy by the node-ddp-client https://github.com/oortcloud/node-ddp-client .

##Usage
###Meteor server
Install Meteor and clone this repository:

```
curl https://install.meteor.com/ | sh
git clone https://github.com/bigredhdl/bbblack-meteor-blinky.git
```

Deploy this app to meteor.com.  Note that you need to change the meteor.com URL to something unique to you.  This will also be necessary in the beaglebone black code since they need to match.
```
cd bbblack-meteor-blinky
meteor deploy --debug bbblack-meteor-blinky.meteor.com
```
The --debug is not necessary, but it makes it easier to play with the client side code using the browser's development tools.

###BeagleBone Black
Now we get to hook the beaglebone black into the Meteor server.  I should note that I used a rev C BeagleBone Black with Debian pre-loaded and BoneScript 0.2.4.  If you still have Angstrom on your BBB you may want to load the latest Debian image.

There are different ways of accessing your BBB, but I prefer to power it from my PC which also lets it enumerate as a network device on the USB bus.  Then you can access the built in cloud9 IDE by pointing your browser to http://192.168.7.2:3000/ide.html .  You should also have your BeagleBone's ethernet port hooked up to the internet via a hub or router or something.  Now using the terminal inside cloud9 you again need to clone this repository and go into the bbblack-meteor-blinky/private folder.
```
git clone https://github.com/bigredhdl/bbblack-meteor-blinky.git
cd bbblack-meteor-blinky/private
```

You probably also need to at least add the ejson and ddp packages to node.
```
npm install ejson
npm install ddp
```
If you get any errors from node.js about missing packages you should be able to install them via npm as well (i.e. underscore etc...)

One more thing before we get to blink something.  You must change line 14 of bbblack-meteor-blinky-hardware.js so that the server URL matches the one we used above when we deployed to the meteor.com server.

```
host : "bbblack-meteor-blinky.meteor.com",
```

Now we should be able to start the BeagleBone Black software.
```
node bbblack-meteor-blinky-hardware.js
```

If all went well, you should be able to go to "bbblack-meteor-blinky.meteor.com" (or whatever you changed the URL to) and toggle your BBB LEDs.
