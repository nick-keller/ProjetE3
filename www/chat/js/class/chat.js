function Chat() {
  window.c = this;

  window.peerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
  window.sessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
  navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;

  c.timeoutDisconnect = null;

  c.peerConnection = null;
  c.dataChannel = null;
  c.localStream = null;
  c.remoteStream = null;

  c.localVideo = document.createElement('video');
  c.localVideo.id = "localVideo";

  c.remoteVideo = document.createElement('video');
  c.remoteVideo.id = "remoteVideo";

  c.notif = document.createElement('p');

  // TESTING
  var base = document.getElementById('base');
  base.appendChild(c.notif);

  c.setNotif("test", true);

  c.localTest();

}

// TODO: notifications
Chat.prototype.initiate = function(param) {

  c.remoteVideo = document.createElement('video');
  c.peerConnection = null;
  c.remoteStream = null;

  localTest();

  navigator.getUserMedia(param, function(stream) {
    if (stream.getAudioTracks().length === 0 && param.audio)
      throw new Error("AUDIO_ERROR");
    if (stream.getVideoTracks().length === 0 && param.video)
      throw new Error("VIDEO_ERROR");
    c.localStream = stream;

    c.peerConnection = new peerConnection();
    c.peerConnection.addStream(c.localStream);
    c.peerConnection.onaddstream = function(event) {
      c.remoteStream = event.stream;
    };
    c.dataChannel = peerConnection.createDataChannel('channel', {});
    c.dataChannel.binaryType = 'blob';
    c.dataChannel.onmessage = onDataChannelMessage;

    c.peerConnection.createOffer(function(offer) {
      // TODO: finish the initialisation
    }, c.errorHandler);
  }, c.errorHandler);
};

/**
 * Handles the recieved message by the data channel
 * @param {Object} event;
 */
Chat.prototype.onDataChannelMessage = function(event) {

  if (c.timeoutDisconnect !== null) {
    clearTimeout(c.timeoutDisconnect);
    c.timeoutDisconnect = setTimeout(function() {
      c.reset();
      // TODO: notify the disconnection
    },5000);
  }


  // TODO: create a protocol to communicate between clients

};


/**
 * Sets the information displayed to the user
 * @param {String} string; The string to display
 * @param {Boolean} success; define the color: false is red, true is green
 */
Chat.prototype.setNotif = function(string, bool) {
  c.notif.innerHTML = string;
  if (bool === undefined) {
    c.notif.style.color = "";
    return;
  }
  if (bool === true) {
    c.notif.style.color = "green";
    return;
  }
  if (bool === false) {
    c.notif.style.color = "red";
    return;
  }
};


Chat.prototype.testBrowser = function(userAgent) {
  // TODO: do for all browsers
  return false;
};



Chat.prototype.checkStunTurn = function(desc) {
  if (!desc.sdp.match(/srflx/))
    return new Error("STUN_ERROR");
  // if (!desc.sdp.match(/turn/))
  //   return new Error("TURN_ERROR");
  return false;
};






Chat.prototype.localTest = function() {

  console.log("localTest started"); /*Debug marker*/
  var pc1;
  var pc2;
  var ok1 = false;
  var ok2 = false;




  // c.handleError(c.testBrowser(navigator.userAgent));
  c.setNotif("Setting up fake stream...");
  navigator.getUserMedia({video: true, audio: true, fake: true},
                          function(fakeStream1) {
    navigator.getUserMedia({video: true, audio: true, fake: true},
                            function(fakeStream2) {
      
      c.setNotif("Testing audio/video tracks...");
    
      var pcDefautlConfig = [{"url": "stun:stun.services.mozilla.com"}];

      // var pcViagenieConfig = {iceServers:
      //   [{
      //     url: "turn:66.228.45.110:3478", // numb.viagenie.ca
      //     username: "benjamin.mousseau@gmail.com",
      //     credential: "webrtc"
      //   }]
      // };

      c.setNotif("Setting pc1...");
      pc1 = new peerConnection(pcDefautlConfig);
      pc1.addStream(fakeStream1);
      pc1.onaddstream = function() {
        if (ok2 === true) {
          c.setNotif("localTest successful, initializing the chat...", true);
          console.log("localTest ended");
        }
        else {
          ok1 = true;
          c.setNotif("Success on view 1. Waiting for view 2...");
        }
      };


      c.setNotif("Setting pc2...");
      pc2 = new peerConnection(pcDefautlConfig);
      pc2.addStream(fakeStream2);
      pc2.onaddstream = function() {
        if (ok1 === true) {
          c.setNotif("localTest successful, initializing the chat...", true);
          console.log("localTest ended");
        }
        else {
          ok2 = true;
          c.setNotif("Success on view 2. Waiting for view 1...");
        }
      };
          
      c.setNotif("Creating offer...");
      pc1.createOffer(function(descO) {

        c.setNotif("Setting pc1 localDescription...");
        pc1.setLocalDescription(descO,function() {

          c.setNotif("Setting pc2 remoteDescription...");
          pc2.setRemoteDescription(new mozRTCSessionDescription(descO),
                                    function() {
     
            c.setNotif("Creating answer...");
            pc2.createAnswer(function(descA) {
             
              c.setNotif("Checking connection to STUN/TURN servers...");
              if (!descA.sdp.match(/srflx/)){
                c.handleError(new Error("STUN_ERROR"));
              }
              // if (!desc.sdp.match(/turn/))
              //   throw new Error("TURN_ERROR");

              c.setNotif("Setting pc2 localDescription...");
              pc2.setLocalDescription(descA,function() {
                
                c.setNotif("Setting pc1 remoteDescription and "+
                            "waiting for onAddStream calls...");
                pc1.setRemoteDescription(new mozRTCSessionDescription(descA),
                                          function(){

                  console.log("pc1: "+
                                occurrences(descO.sdp,"typ host")+
                                " host candidates and "+
                                occurrences(descO.sdp,"typ srflx")+
                                " srflx candidates");

                  console.log("pc2: "+
                                occurrences(descA.sdp,"typ host")+
                                " host candidates and "+
                                occurrences(descA.sdp,"typ srflx")+
                                " srflx candidates");


                },c.handleError);
              },c.handleError);
            },c.handleError);
          },c.handleError);
        },c.handleError);
      },c.handleError);
    },c.handleError);
  },c.handleError);
};   // localTest


/** Function count the occurrences of substring in a string;
 * @param {String} string   Required. The string;
 * @param {String} subString    Required. The string to search for;
 * @param {Boolean} allowOverlapping    Optional. Default: false;
 */
function occurrences(string, subString){

  string+=""; subString+="";
  if(subString.length<=0) return string.length+1;

  var n=0, pos=0;
  var len = subString.length;
  while(true){
    pos=string.indexOf(subString,pos);
    if(pos>=0){ n++; pos+= len; } else break;
  }
  return(n);
}



// TTTTTTTTTTOOOOOOOOOOODDDDDDDDDDDDDDOOOOOOOOOOOOOOO: handleError
Chat.prototype.handleError = function(e) {
  if (e.name !== "Error")
    return;

  switch(e.message){

    // case "NOT_MOZ":
    //   c.setNotif("This test is engineered to be used on Firefox",false);
    //   break;
  
    // case "MOZ_TOO_OLD":
    //   c.setNotif("Your version of Firefox is not up to date<br>"+
    //     "Please update Firefox in <code>Help -> About Firefox</code>",false);
    //   break;
  
    case "AUDIO_ERROR":
      c.setNotif("No sound is captured<ul>"+
        "<li>Check if your microphone is properly connected or muted</li>"+
        "</ul>",false);
      break;
  
    case "VIDEO_ERROR":
      c.setNotif("No video is captured<ul>"+
        "<li>Check if your webcam is properly connected or disabled</li>"+
        "</ul>",false);
      break;
  
    case "PERMISSION_DENIED":
      c.setNotif("The acess to the imput devices has been denied<br><ul>"+
        "<li>Check if there is any program that might block the use of the webcam</li>"+
        "</ul>",false);
      break;
  
    case "HARDWARE_UNAVAILABLE":
      c.setNotif("Your input device(s) is/are alerady in use<br><ul>"+
        "<li>Close any other application that could use your webcam or microphone</li>"+
        "</ul>",false);
      break;
  
    case "NO_DEVICES_FOUND":
      c.setNotif("Ther are no input devices detected<br><ul>"+
        "<li>Verify that your webcam and microphone are properly plugged</li>"+
        "<li>Make sure that the devices are not deactivated (Control pannel in Windows)</li>"+
        "</ul>",false);
      break;
  
    case "STUN_ERROR":
      c.setNotif("Could not connect to the stun server",false);
      break;
  
    case "TURN_ERROR":
      c.setNotif("Could not connect to the turn server",false);
      break;
      
  
    default:
      c.setNotif("The following error occured: <br>"+e.message,false);
  }
  console.log(e);
  throw e;
};