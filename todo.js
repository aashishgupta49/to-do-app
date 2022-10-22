
//------------------------------------------------
//--------------JavaScripted U.U.I.D.-------------
//------------------------------------------------
//	This file allows for the creation of a
//		 Universally Unique I.D. tag
//
//Syntax:
// var id = uuid();
//
//The function "uuid()" needs no arguments and
//returns a 32 byte code in the following format:
//	00000000-0000-0000-0000-0000-00000000
//The "var id =" is optional.
//
//------------------------------------------------
//Produces a random number between min and max.
const zzzrndmN = function (max) {
	let num = max * Math.random();
	return num
};

//Produces a string of characters, named "str", in the reverse order.
const zzzreverse = function (str) {
	let rStr = '';
	for (var i = 0; i < str.length; i++) {
		rStr = str.substring(i, i+1) + rStr;
	};
	return rStr;
};

//Produces a random number, 21 digits long, converts it into a number of the "base" counting system and returns the string of all upper case of  that number.
const zzzrndmHexStr = function (base) {
	let max = Math.pow(10, 10),
		  num = zzzrndmN(max);
	num = num.toString(base);
	num = num.replace('.', 'W');
	num = num.toUpperCase();
	return num;
};

//Produces the Universally Unique I.D. tag.
const uuid = function () {
	//Compiling a character string between 44 & 46 digits long.
	let idString = zzzrndmHexStr(32)
			//Date string is 9 digits long and reversed. 
			+ zzzreverse(Date.now().toString(32).toUpperCase()) 
			+ zzzrndmHexStr(32)
			+ zzzreverse(zzzrndmHexStr(32))
	//Selecting 32 characters from the middle of the above string, causing the date to start at the 1st to 10th position.
	rndmStart = Math.floor(zzzrndmN(11));
	idString = idString.substring(rndmStart, 32+rndmStart);

	//Parse the string with dashes to resemble a standard 32 byte uuid string.
	idString = [idString.substring(0, 8), idString.substring(8, 12), idString.substring(12, 16), 
		idString.substring(16, 20), idString.substring(20, 24), idString.substring(24)].join('-');

	//Send the id tag.
	return idString;
};

//for (i=0; i<100; i++) {
//	let uuidtag = uuid();
//	console.log('id = ' + uuidtag);
//}
//~~~~~~~~~~~FUNCTIONS FOR ToDo APP~~~~~~~~~~~~~~~~~~

//~~~~~~~~~~~~~~~INITIALIZE & ASSIGN~~~~~~~~~~~~~~~
	//Pre-setup for saving this session's undo/redo items.
let undoToDoList = [],
	redoToDoList = [],
	filteredToDos = [];

//~~~~~~~~GET SAVED TO DO LIST~~~~~~~~
const getStoredToDoList = function (aryName) {
	const aryJSON = localStorage.getItem(aryName);
	if (aryJSON !== null) {
		return JSON.parse(aryJSON);
	} else {
		return [{id: "262KR81D-0IC3-MMRG-CNES-HCL4-IS1AKS22", priority: 1, title: "Title", body: "Description", completed: true}, 
			{id: "O6E4G1D0-ICD5-A40F-VUBJ-5F15-4221QMIK", priority: 1, title: "Title", body: "Description", completed: false}, 
			{id: "I5A9K1D0-ICD5-A60G-PJ7I-EPLI-A1F4UAKU", priority: 1, title: "Title1", body: "Description", completed: true}, 
			{id: "4010UG1D-0ICD-5A68-J2P8-AP4V-NM1QOQ1U", priority: 1, title: "Title2", body: "Description", completed: false}];
	}
};


//~~~~~~~~SET (SAVE) ITEM~~~~~~~~
const setStoreItem = function (itemName, itemAry) {
	const strAry = JSON.stringify(itemAry);
	localStorage.setItem(itemName, strAry);
};

//~~~~~~~~UN-DO TRACKING~~~~~~~~
//Returns either:
const undoRedo = function (_do) {
	//Initializing
	let rtrnValue = '';
	//
	switch (_do) {
		case 'undo':
			if (undoToDoList.pop() === undefined) {
				alert('Nothing to Undo!');
				rtrnValue = toDoList;
			} else {
			rtrnValue = undoToDoList.pop();
			redoToDoList.push(toDoList);
			//Will return the prior toDoList state.
			}
			break;
		case 'next':
			undoToDoList.push(toDoList);
			rtrnValue = toDoList;
			//Will return the current list and save it in the undo list.
			break;
		case 'redo':
			if (redoToDoList.pop() === undefined) {
				alert('Nothing to Redo!');
				rtrnValue = toDoList;
			} else {
			rtrnValue = redoToDoList.pop();
			undoToDoList.push(toDoList);
			//Will return the prior un-done state.
			}
			break;
	}
	return rtrnValue;
};

//~~~~~~~~STRING OF 1 TO DO~~~~~~~~
//Create the string of 1 To Do item, given an index and element.
const strOf1ToDo = function (i, obj) {
	return i + ".    " + obj.completed + "     " + obj.priority + "     " + obj.title + "   :   " + obj.body;
};

//~~~~~~~~~~~~~~Reset & Display DOM~~~~~~~~~~~~~
//Reset the DOM to display area properly.
const resetDOM = function (DOMtag, DOMvTag=false, PRNtoDOM=false) {
	if (DOMtag) {
	document.getElementById(DOMtag).innerHTML = '';
	}
	if (DOMvTag) {
		document.getElementById(DOMvTag).value = '';
	}
	if (PRNtoDOM) {
		renderFullToDoList(PRNtoDOM, DOMtag);
	}
};

//~~~~~~~~~~~~~~~DELETE NOTE FUNCTION~~~~~~~~~~~~~~~
const deleteToDo = function (id) {
	const dIndex = toDoList.findIndex(function (el) {
		return (el.id === id);
	});
	const dGo = confirm("Are you sure you're OK with deleting:\n" + "\n"+ strOf1ToDo(dIndex, toDoList[dIndex]));
	//Depending upon cofirm answer.
	if (dGo) {
		//Prepare for an undo action.
		undoRedo('next');
		//Modify toDoList. Remove item from the to do list.
		toDoList.splice(dIndex, 1);
		//Save the motified list.
		setStoreItem('toDoList', toDoList);
		//Re-Render the full list.
		resetDOM('filterDsply');
		resetDOM('toDoList', false, toDoList);
	}
};

//~~~~~~~~CHANGE COMPLETED STATUS FUNCTION~~~~~~~~
const completeChng = function (eventId) {
	const toggleToDo = toDoList.find(function (toDoEl) {
		return (toDoEl.id === elRender.id);
	});
//alert('1.' + );
	if (toggleToDo !== undefined) {
		toggleToDo.completed = !toggleToDo.completed;
	}
	setStoreItem('toDoList', toDoList);
	resetDOM("filterDsply");
	resetDOM('toDoList', false, toDoList);
};

//~~~~~~~~FILTERING FUNCTION~~~~~~~~
//Filter function displays a constantly updated list of matching todo's.
const filter = function (aryToDo, fList) {
	//filter using the text entered and update at each input change.
	filteredToDos = aryToDo.filter(function (el) { 
		if (fList.searchTxt !== "") {
			if (el.title.toLowerCase().includes(fList.searchTxt.toLowerCase())
				||
				el.body.toLowerCase().includes(fList.searchTxt.toLowerCase())
				) {return true;
			} else	return false;
		} else return false;
	});

	//filter using the check box value.
	filteredToDos = filteredToDos.filter(function(el) {
		return fList.viewCompleted === el.completed;
	});
	return filteredToDos;
};

//--------- EVENT LISTENERS -----------
//Function to activate event listeners.
const eListeners = function (ary) {
	ary.forEach(function(el) {
		document.querySelector("#"+el[0]).addEventListener(el[1], el[2]);
	});
};

//------ DISPLAY full TODOLIST --------
//Rendering on HTML web page the drop down full to do list.
const renderFullToDoList = function(aryToDos, DOMtag) {
	//Populate the drop down area with the full list of ToDo's.
	let i = 1;
	aryToDos.forEach(function (elRender) {
		let id = elRender.id,
			row = document.createElement('tr'),
			col1 = document.createElement('td'),
			completeBox = document.createElement('input'),
			toDoTxt = document.createElement('td'),
			col3 = document.createElement('td'),
			deleteBttn = document.createElement('button');

		completeBox.setAttribute('type', 'checkbox');
		completeBox.setAttribute('class', 'completeBox');
		completeBox.setAttribute('id', elRender.id);
		completeBox.checked = elRender.completed;
		completeBox.addEventListener('change', function () {
			const toggleToDo = toDoList.find(function (toDoEl) {
				return (toDoEl.id === elRender.id);
			});
			undoRedo('next');
			if (toggleToDo !== undefined) {
				toggleToDo.completed = !toggleToDo.completed;
			}
			setStoreItem('toDoList', toDoList);
			resetDOM("filterDsply");
			resetDOM('toDoList', false, toDoList);
		});
		//completeChng(elRender.id));
		
		toDoTxt.textContent = strOf1ToDo(i, elRender);
		i++;
		
		deleteBttn.textContent = "x";
		deleteBttn.setAttribute('class', 'deleteBttn');
		deleteBttn.setAttribute('id', elRender.id);
		deleteBttn.addEventListener('click', function () {
			const dIndex = toDoList.findIndex(function (elToDo) {
				return (elRender.id === elToDo.id);
			});
			undoRedo('next');
			toDoList.splice(dIndex, 1);
			setStoreItem('toDoList', toDoList);
			resetDOM('filterDsply');
			resetDOM('toDoList', false, toDoList);
		});
		//deleteToDo(elRender.id));
		
		row.appendChild(col1);
		col1.appendChild(completeBox);
		row.appendChild(toDoTxt);
		row.appendChild(col3);
		col3.appendChild(deleteBttn);
		
		document.querySelector('#'+DOMtag).appendChild(row);
	});
};

alert("functions.js loaded");


//####################################################
//------- no active code follows ------
/*
bbtnClick.removeEventListener('click', clickEvent, false);

//Calculate number of ToDo's left to do and display message.
//	let toDoLeft = toDoList.filter(function(el) {
//		if (!el.completed) return true;
//	}).length;
//	MSG(plcLoc.toDoListTitle2, `* = The ${toDoLeft} to do items yet to complete.`);

//Filtering through all <p> elements and removing the ones with the word "fuck" in them.
let pa = document.querySelectorAll("p");
pa.forEach(function(p) {
   if (p.textContent.toLowerCase().includes("fuck")) {
      l(p.textContent);
      p.remove();
   }
});
*/
//~~~~~~~~~~~~~~~File:  scripts.js~~~~~~~~~~~~~~~
//Executes main flow functions.

//~~~~~~~~~~~~~~~INITIALIZE & ASSIGN~~~~~~~~~~~~~~~
	//Get the to do list from storage.
let toDoList = getStoredToDoList('toDoList'),
	//Initialize the default filters.
	filters = {	searchTxt: "", viewCompleted: false};


//########################EVENT FUNCTIONS############

//~~~~~~~~~~~~~~~FILTERING~~~~~~~~~~~~~~~
//Function to set the filters with the filtering text.  Then filter again.
const txtFilter = function(event) {
	filters.searchTxt = event.target.value;
	resetDOM('filterDsply', false, filter(toDoList, filters));
};
//~~~~~~~~~~~~~~~
//Function to set the filters to diaplay completed.  Then filter again.
const filterCompleted = function(event) {
	filters.viewCompleted = event.target.checked;
	resetDOM('filterDsply', false, filter(toDoList, filters));
};

//~~~~~~~~~~~~~~~ADD NEW TO DO~~~~~~~~~~~~~~~
//Adding the new to do into the list via buttonClick.
let buttonClick = function(event) {
	event.preventDefault();
	
	//Make the new To Do item.
	let nToDo = {
		id: "poop",//uuid(),
		priority: event.target.elements.priority.value,
		title: event.target.elements.title.value,
		body: event.target.elements.body.value,
		completed: event.target.elements.completed.checked
	};
	//Prepare for undoing.
	undoRedo('next');
	//Splice the new To Do item into the master list at index orderNumber.
	toDoList.splice((event.target.elements.order.value-1), 0, nToDo);
	//Save the list with the new item.
	setStoreItem('toDoList', toDoList);
	//Clear DOM area.
	resetDOM("filterDsply");
	//Display the master list with the new item.
	resetDOM('toDoList', false, toDoList);
	//Clear the DOM fields.
	event.target.elements.order.value = "";
	event.target.elements.priority.value = "";
	event.target.elements.title.value = "";
	event.target.elements.body.value = "";
	event.target.elements.completed.checked = false;
};

//~~~~~~~~~~~~~~~DELETE TO DO ITEM~~~~~~~~~~~~~~~
//Function for the submit form event for it's button.
const bDelete = function (event) {
	event.preventDefault();
	//Get the order number and then clear the DOM field.
	const dOrder = event.target.elements.dOrder.value;
	event.target.elements.dOrder.value = "";
	//Retreive the item to be deleted and ask for conformation.
	const dToDo = toDoList[dOrder-1];
	const dGo = confirm(
		"Are you sure you're OK with deleting:\n" 
		+ "\n" + strOf1ToDo(dOrder, dToDo));
	//Depending upon cofirm answer.
	if (dGo) {
		//Prepare for an undo action.
		undoRedo('next');
		//Remove item from the to do list.
		toDoList.splice(dOrder-1, 1);
		//Save the motified list.
		setStoreItem('toDoList', toDoList);
		//Reset DOM.
		resetDOM('filterDsply');
		resetDOM('toDoList', false, toDoList);
	}
};


//~~~~~~~~~~~~~~~SORT FUNCTION~~~~~~~~~~~~~~~
//Unfinished.
const sortDsply = function(event) {
	alert("Sorting by: "+JSON.stringify(event.target.value));
};


//########################EVENT LISTENERS##########

//Initialize and activate event listeners to begin client interaction.
//Syntax: [ element's id tag , what event are we listening for , function to call when triggered ]
// (simplified) [ tag id, listening event, function ]
const eListenList = [
	['filter', 'input', txtFilter],
	['fCompleted', 'change', filterCompleted],
	['nToDo', 'submit', buttonClick],
	['bDelete', 'submit', bDelete],
	['sortDsply', 'change', sortDsply]
];

//~~~~~~~~~~~~~~~EVENT LISTENERS~~~~~~~~~~~~~~~
//Activate all the listeners to make page interactive.
eListeners(eListenList);


//########################DISPLAY FILLING#############

//~~~~~~~~~~~~~~RENDERING ON WEB PAGE~~~~~~~~~~~~~~~~
//Assign the list title area.
resetDOM('toDoList', false, toDoList);

alert("Script done loading.");
