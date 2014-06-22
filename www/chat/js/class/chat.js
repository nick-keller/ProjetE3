function Chat() {
	window._c = this;

	this.retry = false;

	window.peerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
	window.sessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
	navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;

	_c.timeoutDisconnect = null;

	_c.peerConnection = null;
	_c.dataChannel = null;
	_c.localStream = null;
	_c.remoteStream = null;

	_c.localVideo = document.createElement('video');
	_c.localVideo.id = "localVideo";

	_c.remoteVideo = document.createElement('video');
	_c.remoteVideo.id = "remoteVideo";

	_c.notif = document.createElement('p');

	// TESTING
	var base = document.getElementById('base');
	base.appendChild(_c.notif);

	_c.localTest();

}

// TODO: notifications
Chat.prototype.initiate = function(param) {

	_c.remoteVideo = document.createElement('video');
	_c.peerConnection = null;
	_c.remoteStream = null;

	navigator.getUserMedia(param, function(stream) {
		if (stream.getAudioTracks().length === 0 && param.audio)
			throw new Error("AUDIO_ERROR");
		if (stream.getVideoTracks().length === 0 && param.video)
			throw new Error("VIDEO_ERROR");
		_c.localStream = stream;

		_c.peerConnection = new peerConnection({
			"iceServers": [{
					url: 'stun:stun.services.mozilla.com'
				}, {
					url: 'stun:stun.l.google.com:19302'
				}, {
					url: 'stun:stun1.l.google.com:19302'
				}, {
					url: 'stun:stun2.l.google.com:19302'
				}, {
					url: 'stun:stun3.l.google.com:19302'
				}, {
					url: 'stun:stun4.l.google.com:19302'
				},
				// {
				//     url: 'turn:numb.viagenie.ca',
				//     credential: 'muazkh',
				//     username: 'webrtc@live.com'
				// },
				// {
				//     url: 'turn:192.158.29.39:3478?transport=udp',
				//     credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
				//     username: '28224511:1379330808'
				// },
				// {
				//     url: 'turn:192.158.29.39:3478?transport=tcp',
				//     credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
				//     username: '28224511:1379330808'
				// }
			]
		});

		_c.peerConnection.addStream(_c.localStream);
		_c.peerConnection.onaddstream = function(event) {
			_c.remoteStream = event.stream;
		};
		_c.dataChannel = peerConnection.createDataChannel('channel', {});
		_c.dataChannel.binaryType = 'blob';
		_c.dataChannel.onmessage = onDataChannelMessage;

		_c.peerConnection.createOffer(function(offer) {
			// TODO: finish the initialisation
		}, _c.errorHandler);
	}, _c.errorHandler);
};

/**
 * Handles the recieved message by the data channel
 * @param {Object} event;
 */
Chat.prototype.onDataChannelMessage = function(event) {

	if (_c.timeoutDisconnect !== null) {
		clearTimeout(_c.timeoutDisconnect);
		_c.timeoutDisconnect = setTimeout(function() {
			_c.reset();
			// TODO: notify the disconnection
		}, 5000);
	}


	// TODO: create a protocol to communicate between clients

};


/**
 * Sets the information displayed to the user
 * @param {String} string; The string to display
 * @param {Boolean} success; define the color: false is red, true is green
 */
Chat.prototype.setNotif = function(string, bool) {
	_c.notif.innerHTML = string;
	if (bool === undefined) {
		_c.notif.style.color = "";
		return;
	}
	if (bool === true) {
		_c.notif.style.color = "green";
		return;
	}
	if (bool === false) {
		_c.notif.style.color = "red";
		return;
	}
};




Chat.prototype.localTest = function() {

	console.log("localTest started"); /*Debug marker*/
	var pc1;
	var pc2;
	var ok1 = false;
	var ok2 = false;

	var browser = null;

	var userAgent = navigator.userAgent;

	if (userAgent.match(/Firefox/)) {
		if (userAgent.match(/Firefox\/[0-9]+\./)[1] < 29) {
			_c.handleError(new Error("MOZ_TOO_OLD"));
		} else {
			browser = "mozilla";
		}
	}

	if (userAgent.match(/Chrome/)) {
		if (userAgent.match(/Chrome\/[0-9]+\./)[1] < 34) {
			_c.handleError(new Error("CHROME_TOO_OLD"));
		} else {
			browser = "chrome";
		}
	}


	_c.setNotif("Setting up fake stream...");
	navigator.getUserMedia({
			video: true,
			audio: true,
			fake: true
		},
		function(fakeStream1) {
			navigator.getUserMedia({
					video: true,
					audio: true,
					fake: true
				},
				function(fakeStream2) {

					_c.setNotif("Testing audio/video tracks...");


					var pcDefautlConfig = {
						"iceServers": [{
								url: 'stun:stun.services.mozilla.com'
							}, {
								url: 'stun:stun.l.google.com:19302'
							}, {
								url: 'stun:stun1.l.google.com:19302'
							}, {
								url: 'stun:stun2.l.google.com:19302'
							}, {
								url: 'stun:stun3.l.google.com:19302'
							}, {
								url: 'stun:stun4.l.google.com:19302'
							},
							// {
							//     url: 'turn:numb.viagenie.ca',
							//     credential: 'muazkh',
							//     username: 'webrtc@live.com'
							// },
							// {
							//     url: 'turn:192.158.29.39:3478?transport=udp',
							//     credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
							//     username: '28224511:1379330808'
							// },
							// {
							//     url: 'turn:192.158.29.39:3478?transport=tcp',
							//     credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
							//     username: '28224511:1379330808'
							// }
						]
					};

					_c.setNotif("Setting up pc1...");
					pc1 = new peerConnection(pcDefautlConfig);
					pc1.addStream(fakeStream1);
					pc1.onaddstream = function() {
						if (ok2 === true) {
							localTestEnded();
						} else {
							ok1 = true;
							_c.setNotif("Success on view 1. Waiting for view 2...");
						}
					};


					_c.setNotif("Setting up pc2...");
					pc2 = new peerConnection(pcDefautlConfig);
					pc2.addStream(fakeStream2);
					pc2.onaddstream = function() {
						if (ok1 === true) {
							localTestEnded();
						} else {
							ok2 = true;
							_c.setNotif("Success on view 2. Waiting for view 1...");
						}
					};

					_c.setNotif("Creating offer...");
					pc1.createOffer(function(descO) {

						_c.setNotif("Setting pc1 localDescription...");
						pc1.setLocalDescription(descO, function() {

							_c.setNotif("Setting pc2 remoteDescription...");
							pc2.setRemoteDescription(new sessionDescription(descO),
								function() {

									_c.setNotif("Creating answer...");
									pc2.createAnswer(function(descA) {
										console.log("\n\n" + descO.sdp + "\n\n"); /*Debug marker*/

										_c.setNotif("Checking connection to STUN/TURN servers...");
										if (!descA.sdp.match(/host/) && browser === "mozilla")
											_c.handleError(new Error("CONNEC_ERROR"));

										if (!descA.sdp.match(/srflx/) && browser === "mozilla")
											_c.handleError(new Error("STUN_ERROR"))
											// if (!desc.sdp.match(/turn/))
											//   throw new Error("TURN_ERROR");

										_c.setNotif("Setting pc2 localDescription...");
										pc2.setLocalDescription(descA, function() {

											_c.setNotif("Setting pc1 remoteDescription and " +
												"waiting for onAddStream calls...");
											pc1.setRemoteDescription(new sessionDescription(descA),
												function() {
													if (browser === "mozilla") {
														console.log("pc1: " +
															occurrences(descO.sdp, "typ host") +
															" host candidates and " +
															occurrences(descO.sdp, "typ srflx") +
															" srflx candidates");

														console.log("pc2: " +
															occurrences(descA.sdp, "typ host") +
															" host candidates and " +
															occurrences(descA.sdp, "typ srflx") +
															" srflx candidates");
													}

												}, _c.handleError);
										}, _c.handleError);
									}, _c.handleError);
								}, _c.handleError);
						}, _c.handleError);
					}, _c.handleError);
				}, _c.handleError);
		}, _c.handleError);


	/** Function to call when the local test ended sucessfully;
	 */
	function localTestEnded() {
		pc1.close();
		pc2.close();
		_c.setNotif("localTest successful, initializing the chat...", true);
		console.log("localTest ended");
		initiate.bind(_c);
		return;
	}

	/** Function count the occurrences of substring in a string;
	 * @param {String} string   Required. The string;
	 * @param {String} subString    Required. The string to search for;
	 * @param {Boolean} allowOverlapping    Optional. Default: false;
	 */
	function occurrences(string, subString) {

		string += "";
		subString += "";
		if (subString.length <= 0) return string.length + 1;

		var n = 0,
			pos = 0;
		var len = subString.length;
		while (true) {
			pos = string.indexOf(subString, pos);
			if (pos >= 0) {
				n++;
				pos += len;
			} else break;
		}
		return (n);
	}

}; // localTest




Chat.prototype.handleError = function(e) {
	if (e.name !== "Error")
		return;

	switch (e.message) {

		case "MOZ_TOO_OLD":
			_c.setNotif("Your version of Firefox isnt up to date.<br>" +
				"Please update it <a href=''>here</a>", false);
			break;

		case "CHROME_TOO_OLD":
			_c.setNotif("Your version of Chrome isnt up to date.<br>" +
				"Please update it <a href=''>here</a>", false);
			break;

		case "AUDIO_ERROR":
			_c.setNotif("No sound is captured<ul>" +
				"<li>Check if your microphone is properly connected or muted</li>" +
				"</ul>", false);
			break;

		case "VIDEO_ERROR":
			_c.setNotif("No video is captured<ul>" +
				"<li>Check if your webcam is properly connected or disabled</li>" +
				"</ul>", false);
			break;

		case "PERMISSION_DENIED":
			_c.setNotif("The acess to the imput devices has been denied<br><ul>" +
				"<li>Check if there is any program that might block the use of the webcam</li>" +
				"</ul>", false);
			break;

		case "HARDWARE_UNAVAILABLE":
			_c.setNotif("Your input device(s) is/are alerady in use<br><ul>" +
				"<li>Close any other application that could use your webcam or microphone</li>" +
				"</ul>", false);
			break;

		case "NO_DEVICES_FOUND":
			_c.setNotif("Ther are no input devices detected<br><ul>" +
				"<li>Verify that your webcam and microphone are properly plugged</li>" +
				"<li>Make sure that the devices are not deactivated (Control pannel in Windows)</li>" +
				"</ul>", false);
			break;

		case "CONNEC_ERROR":
			_c.setNotif("Could not connect to the internet", false);
			break;

		case "STUN_ERROR":
			_c.setNotif("Could not connect to the stun server", false);
			break;

		case "TURN_ERROR":
			_c.setNotif("Could not connect to the turn server", false);
			break;


		default:
			_c.setNotif("The following error occured: <br>" + e.message, false);
	}
	console.log(e);
	throw e;
};