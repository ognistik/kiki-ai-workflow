ObjC.import('stdlib');
ObjC.import('Foundation');

function run(argv) {
	// first command-line argument is the user's query
	const userInput = argv[0];
	var fromAlfred = $.getenv('kiki_data');
	const chatModel = $.getenv('chatModel');
	const chatModelB = $.getenv('chatModelB');
	const theAction = $.getenv('theAction');
	const dataPath = fromAlfred;
	const wfPath = $.NSFileManager.defaultManager.currentDirectoryPath.js;
	let theTitle = "";
	let theSub = `Continue in dialog, reset context, and use "${chatModel}."`;
	let kikiType = "dialogChat";
	let fnType = "";
	let fn6 = "";
	let fn10 = "";
	let fn13 = "";
	let fn16 = "";
	let theRequest;

	try {
		theText = $.getenv('theText');
	} catch (error) {
		theText = '';
	}
	try {
		transcription = $.getenv('transcription');
	} catch (error) {
		transcription = '';
	}
	try {
		customPromptText = $.getenv('customPromptText');
	} catch (error) {
		customPromptText = '';
	}
	try {
		kikiMods = parseInt($.getenv('kikiMods'), 10);
	} catch (error) {
		kikiMods = '';
	}
	try {
		kikiCopy = $.getenv('kikiCopy'); // When the user enters directly to Actions menu
	} catch (error) {
		kikiCopy = '';
	}
	try {
		contextProcess = $.getenv('contextProcess');
	} catch (error) {
		contextProcess = "reset";
	}

	if ((kikiCopy === 'custom' || kikiCopy === '') && (transcription === '')) {
		fnType = "dialogChat";
		theTitle = "Input the Text for your Chosen Action";
		fn6 = `Continue in dialog, reset context, and use "${chatModel}."`;
		fn10 = `Continue in dialog, reset context, and use "${chatModelB}."`;
		fn13 = `Continue in dialog, do not reset context, and use "${chatModel}."`;
		fn16 = `Continue in dialog, do not reset context, and use "${chatModelB}."`;
		fn20 = `Continue in dialog, reset context, and choose a model from the preset list.`
		fn22 = `Continue in dialog, do not reset context, and choose a model from the preset list.`
	} else {
		fnType = "insertBelow";
		theTitle = "Type the Prompt for your Text";
		fn6 = `Insert below, reset context, and use "${chatModel}."`;
		fn10 = `Insert below, reset context, and use "${chatModelB}."`;
		fn13 = `Insert below, do not reset context, and use "${chatModel}."`;
		fn16 = `Insert below, do not reset context, and use "${chatModelB}."`;
		fn20 = `Insert below, reset context, and choose a model from the preset list.`
		fn22 = `Insert below, do not reset context, and choose a model from the preset list.`
	}

    if (kikiMods === 1) {
        theSub = `Continue in dialog, reset context, and use "${chatModel}."`;
        kikiType = "dialogChat";
    } else if (kikiMods === 2) {
        theSub = `Continue in dialog, reset context, and use "${chatModelB}."`;
        kikiType = "dialogChat";
    } else if (kikiMods === 3) {
		theSub = `Continue in dialog, do not reset context, and use "${chatModel}."`;
		kikiType = "dialogChat";
	} else if (kikiMods === 4) {
		theSub = `Paste in frontmost app, reset context, and use "${chatModel}."`;
		kikiType = "replaceAll";
	} else if (kikiMods === 5) {
		theSub = `Continue in dialog, reset context, and use "${chatModel}."`;
		kikiType = "dialogChat";
	} else if (kikiMods === 6) {
		theSub = fn6;
		kikiType = fnType;
	} else if (kikiMods === 7) {
		theSub = `Continue in dialog, do not reset context, and use "${chatModelB}."`;
		kikiType = "dialogChat";
	} else if (kikiMods === 8) {
		theSub = `Paste in frontmost app, reset context, and use "${chatModelB}."`;
		kikiType = "replaceAll";
	} else if (kikiMods === 9) {
		theSub = `Continue in dialog, reset context, and use "${chatModelB}."`;
		kikiType = "dialogChat";
	} else if (kikiMods === 10) {
		theSub = fn10;
		kikiType = fnType;
	} else if (kikiMods === 11) {
		theSub = `Paste in frontmost app, do not reset context, and use "${chatModel}."`;
		kikiType = "replaceAll";
	} else if (kikiMods === 12) {
		theSub = `Continue in dialog, do not reset context, and use "${chatModel}."`;
		kikiType = "dialogChat";
	} else if (kikiMods === 13) {
		theSub = fn13;
		kikiType = fnType;
	} else if (kikiMods === 14) {
		theSub = `Paste in frontmost app, do not reset context, and use "${chatModelB}."`;
		kikiType = "replaceAll";
	} else if (kikiMods === 15) {
		theSub = `Continue in dialog, do not reset context, and use "${chatModelB}."`;
		kikiType = "dialogChat";
	} else if (kikiMods === 16) {
		theSub = fn16;
		kikiType = fnType;
	} else if (kikiMods === 17) {
		theSub = `Continue in dialog, reset context, and choose a model from the preset list.`;
		kikiType = "dialogChat";
	} else if (kikiMods === 18) {
		theSub = `Paste in frontmost app, reset context, and choose a model from the preset list.`;
		kikiType = "replaceAll";
	} else if (kikiMods === 19) {
		theSub = `Continue in dialog, do not reset context, and choose a model from the preset list.`;
		kikiType = "dialogChat";
	} else if (kikiMods === 20) {
		theSub = fn20;
		kikiType = fnType;
	} else if (kikiMods === 21) {
		theSub = `Paste in frontmost app, do not reset context, and choose a model from the preset list.`;
		kikiType = "replaceAll";
	} else if (kikiMods === 22) {
		theSub = fn22;
		kikiType = fnType;
	}
	
	
	// Function to for mods and theSub
	function deepClone(obj) {
		return JSON.parse(JSON.stringify(obj));
	}
	
	// Function to read and process JSON file, adapted for your requirements
	function readAndFindAction(filePath, theAction, userInput) {
		const fileManager = $.NSFileManager.defaultManager;
		if (fileManager.fileExistsAtPath(filePath)) {
			const content = $.NSString.stringWithContentsOfFileEncodingError(filePath, $.NSUTF8StringEncoding, null);
			const actions = JSON.parse(content.js); // Parse the JSON content
			
			// Find the action by uid
			const action = actions.find(action => action.id === theAction);
			if (action) {
				// Replace [[txt]] with userInput in thePrompt
				return action.thePrompt.replace('[[txt]]', userInput);
			}
		}
		return null; // Return null if file doesn't exist or action not found
	}
	
	// Assuming wfPath, dataPath, theAction, and userInput are already defined
	const kikiActionsPath = `${wfPath}/assets/kiki_text.json`;
	const userActionsPath = `${dataPath}/presets/text.json`;
	
	// Special handling for "customPrompt" preset
	if (theAction === "customPrompt") {
		theRequest = `${userInput}\n${customPromptText}`;
	} else {
		// Attempt to find the action in kiki_text.json
		theRequest = readAndFindAction(kikiActionsPath, theAction, userInput);
		
		// If not found in kiki_text.json, try in text.json
		if (theRequest === null) {
			theRequest = readAndFindAction(userActionsPath, theAction, userInput);
		}
		
		// If theRequest is still null, handle the case where the preset wasn't found in either file
		if (theRequest === null) {
			theRequest = ''; // Or handle as needed
		}
	}
	
	if (theRequest === '') {
		theRequest = "-";
	}
	if (userInput === '') {
		theRequest = "";
	}
	
	const mods = {
	"cmd": {
			"valid": true,
			"variables": {
				"kikiType": "dialogChat",
				"theRequest": theRequest,
				"contextProcess": "reset",
				"chatAlt": "Yes"
			},
			"subtitle": `Continue in dialog, reset context, and use "${chatModelB}."`
		},
		"ctrl": {
			"valid": true,
			"variables": {
				"kikiType": "dialogChat",
				"theRequest": theRequest,
				"contextProcess": "original"
			},
			"subtitle": `Continue in dialog, do not reset context, and use "${chatModel}."`
		},
		"alt": {
			"valid": true,
			"variables": {
			"kikiType": "replaceAll",
			"theRequest": theRequest,
			"contextProcess": "reset"
			},
			"subtitle": `Paste in frontmost app, reset context, and use "${chatModel}."`
		},
		"shift": {
			"valid": true,
			"arg": "",
			"variables": {
			"kikiType": "dialogChat",
			"theRequest": theRequest,
			"contextProcess": "reset"
			},
			"subtitle": `Continue in dialog, reset context, and use "${chatModel}."`
		},
		"fn": {
			"valid": true,
			"arg": "",
			"variables": {
			"kikiType": fnType,
			"theRequest": theRequest,
			"contextProcess": "reset"
			},
			"subtitle": fn6
		},
		"shift+fn": {
			"valid": true,
			"arg": "",
			"variables": {
			"kikiType": "dialogChat",
			"theRequest": theRequest,
			"contextProcess": "reset",
			"chatAlt": "List"
			},
			"subtitle": `Continue in dialog, reset context, and use a model from the user presets list.`
		},
		"cmd+ctrl": {
			"valid": true,
			"arg": "",
			"variables": {
			"kikiType": "dialogChat",
			"theRequest": theRequest,
			"chatAlt": "Yes",
			"contextProcess": "original"
			},
			"subtitle": `Continue in dialog, do not reset context, and use "${chatModelB}."`
		},
		"cmd+alt": {
			"valid": true,
			"arg": "",
			"variables": {
			"kikiType": "replaceAll",
			"theRequest": theRequest,
			"contextProcess": "reset",
			"chatAlt": "Yes"
			},
			"subtitle": `Paste in frontmost app, reset context, and use "${chatModelB}."`
		},
		"cmd+shift": {
			"valid": true,
			"arg": "",
			"variables": {
			"kikiType": "dialogChat",
			"theRequest": theRequest,
			"contextProcess": "reset",
			"chatAlt": "Yes"
			},
			"subtitle": `Continue in dialog, reset context, and use "${chatModelB}."`
		},
		"cmd+fn": {
			"valid": true,
			"arg": "",
			"variables": {
			"kikiType": fnType,
			"theRequest": theRequest,
			"contextProcess": "reset",
			"chatAlt": "Yes"
			},
			"subtitle": fn10
		},
		"ctrl+alt": {
			"valid": true,
			"arg": "",
			"variables": {
			"kikiType": "replaceAll",
			"theRequest": theRequest,
			"contextProcess": "original"
			},
			"subtitle": `Paste in frontmost app, do not reset context, and use "${chatModel}."`
		},
		"ctrl+shift": {
			"valid": true,
			"arg": "",
			"variables": {
			"kikiType": "dialogChat",
			"theRequest": theRequest,
			"contextProcess": "original"
			},
			"subtitle": `Continue in dialog, do not reset context, and use "${chatModel}."`
		},
		"ctrl+fn": {
			"valid": true,
			"arg": "",
			"variables": {
			"kikiType": fnType,
			"theRequest": theRequest,
			"contextProcess": "original"
			},
			"subtitle": fn13
		},
		"cmd+ctrl+alt": {
			"valid": true,
			"arg": "",
			"variables": {
			"kikiType": "replaceAll",
			"theRequest": theRequest,
			"chatAlt": "Yes",
			"contextProcess": "original"
			},
			"subtitle": `Paste in frontmost app, do not reset context, and use "${chatModelB}."`
		},
		"cmd+ctrl+shift": {
			"valid": true,
			"arg": "",
			"variables": {
			"kikiType": "dialogChat",
			"theRequest": theRequest,
			"chatAlt": "Yes",
			"contextProcess": "original"
			},
			"subtitle": `Continue in dialog, do not reset context, and use "${chatModelB}."`
		},
		"cmd+ctrl+fn": {
			"valid": true,
			"arg": "",
			"variables": {
			"kikiType": fnType,
			"theRequest": theRequest,
			"chatAlt": "Yes",
			"contextProcess": "original"
			},
			"subtitle": fn16
		},
		"shift+fn": {
			"valid": true,
			"arg": "",
			"variables": {
				"kikiType": "dialogChat",
				"theRequest": theRequest,
				"chatAlt": "List",
				"contextProcess": "reset"
			},
			"subtitle": `Continue in dialog, reset context, and choose a model from the preset list.`
		},
		"shift+fn+alt": {
			"valid": true,
			"arg": "",
			"variables": {
				"kikiType": "replaceAll",
				"theRequest": theRequest,
				"chatAlt": "List",
				"contextProcess": "reset"
			},
			"subtitle": `Paste in frontmost app, reset context, and choose a model from the preset list.`
		},
		"shift+fn+ctrl": {
			"valid": true,
			"arg": "",
			"variables": {
				"kikiType": "dialogChat",
				"theRequest": theRequest,
				"chatAlt": "List",
				"contextProcess": "original"
			},
			"subtitle": `Continue in dialog, do not reset context, and choose a model from the preset list.`
		},
		"shift+fn+cmd": {
			"valid": true,
			"arg": "",
			"variables": {
				"kikiType": fnType,
				"theRequest": theRequest,
				"chatAlt": "List",
				"contextProcess": "reset"
			},
			"subtitle": fn20
		},
		"shift+fn+ctrl+alt": {
			"valid": true,
			"arg": "",
			"variables": {
				"kikiType": "replaceAll",
				"theRequest": theRequest,
				"chatAlt": "List",
				"contextProcess": "original"
			},
			"subtitle": `Paste in frontmost app, do not reset context, and choose a model from the preset list.`
		},
		"shift+fn+cmd+ctrl": {
			"valid": true,
			"arg": "",
			"variables": {
				"kikiType": fnType,
				"theRequest": theRequest,
				"chatAlt": "List",
				"contextProcess": "original"
			},
			"subtitle": fn22
		}
	};
	
	const scriptFilterItem = {
		"items": [
			{
				"uid": "customInput",
				"type": "default",
				"title": theTitle,
				"subtitle": theSub,
				"variables": {
					"kikiType": kikiType,
					"theRequest": theRequest,
					"contextProcess": contextProcess
				},
				"mods": mods
			}
		]
	};

return JSON.stringify(scriptFilterItem);
}