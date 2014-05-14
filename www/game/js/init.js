window.g = new Game();


// Gestion des notifications
var notifTimeout;

function setNotif(a) {
	clearTimeout(notifTimeout);
	notifTimeout = null;
	document.getElementById('notif').innerHTML = a;
}



// // Gestion des clics
// var clickState = null;

// var onCellClick = function(e){
// 	var cellClicked = e.target;
// 	console.log(clickState); /*Debug marker*/
// 	console.log(cellClicked); /*Debug marker*/
// 	if (clickState !== null){
// 		switch(clickState.state){
// 			case "unit_clicked":
// 				if (cellClicked.unit === null) {
// 					clickState.stored.unit.moveToCell(cellClicked.x, cellClicked.y);
// 					clickState = null;
// 				}
// 				setNotif("Unit moved.");
// 				notifTimeout = setTimeout(setNotif,1000,"null");
// 				break;
// 		} // switch
// 	} else if (cellClicked.unit !== null) {
// 		clickState = {
// 			state: 'unit_clicked',
// 			stored: cellClicked
// 		};
// 		setNotif("Unit selected. Click on where you want to move it.");
// 		colorCell(cellClicked.x, cellClicked.y, "violet");
// 	} else {}
// };