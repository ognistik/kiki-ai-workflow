ObjC.import('stdlib');
ObjC.import('Foundation');

function run(argv) {
	var fromAlfred = $.getenv('kiki_data');
	let chatModel = $.getenv('chatModel');
	let chatSystem = $.getenv('chatSystem');
	const chatModelB = $.getenv('chatModelB');
	const dataPath = fromAlfred;
	const wfPath = $.NSFileManager.defaultManager.currentDirectoryPath.js;
	let kikiType = "dialogChat";
	let theSub = "";
	let fnType = "";
	let fn6 = "";
	let fn10 = "";
	let fn13 = "";
	let fn16 = "";
	let indicator = "";
    // More options to be set on the json presets
	let temperature = $.getenv('temperature');
	let maxTokens = $.getenv('maxTokens');
	let frePenalty = $.getenv('frePenalty');
	let prePenalty = $.getenv('prePenalty');
	let topP = $.getenv('topP');

	try {
		theText = $.getenv('theText');
	} catch (error) {
		theText = '';
	}
	try {
		kikiMods = parseInt($.getenv('kikiMods'), 10);
	} catch (error) {
		kikiMods = '';
	}
	try {
		contextProcess = $.getenv('contextProcess');
	} catch (error) {
		contextProcess = "reset";
	}

	if (theText !== '') {
		indicator = " (Selected Text)";
		theSub = `Continue in dialog, reset context, and use "${chatModel}."`;
		fnType = "insertBelow";
		fn6 = `Insert below, reset context, and use "${chatModel}."`;
		fn10 = `Insert below, reset context, and use "${chatModelB}."`;
		fn13 = `Insert below, do not reset context, and use "${chatModel}."`;
		fn16 = `Insert below, do not reset context, and use "${chatModelB}."`;
		fn20 = `Insert below, reset context, and choose a model from the preset list.`
		fn22 = `Insert below, do not reset context, and choose a model from the preset list.`
	} else {
		theSub = "CHOOSE AN ACTION. Input will be requested in the next step."
		fnType = "dialogChat";
		fn6 = `Continue in dialog, reset context, and use "${chatModel}."`;
		fn10 = `Continue in dialog, reset context, and use "${chatModelB}."`;
		fn13 = `Continue in dialog, do not reset context, and use "${chatModel}."`;
		fn16 = `Continue in dialog, do not reset context, and use "${chatModelB}."`;
		fn20 = `Continue in dialog, reset context, and choose a model from the preset list.`
		fn22 = `Continue in dialog, do not reset context, and choose a model from the preset list.`
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

	const mods = {
		"cmd": {
			"valid": true,
			"variables": {
					"kikiMods": 2,
					"kikiType": "dialogChat",
					"contextProcess": "reset",
					"chatAlt": "Yes",
					"chatSystem": chatSystem,
					"temperature": temperature,
					"maxTokens": maxTokens,
					"frePenalty": frePenalty,
					"prePenalty": prePenalty,
					"topP": topP,
					"theRequest": theText
			},
			"subtitle": `Continue in dialog, reset context, and use "${chatModelB}."`
		},
		"ctrl": {
			"valid": true,
			"variables": {
					"kikiMods": 3,
					"kikiType": "dialogChat",
					"contextProcess": "original",
					"chatModel": chatModel,
					"chatSystem": chatSystem,
					"temperature": temperature,
					"maxTokens": maxTokens,
					"frePenalty": frePenalty,
					"prePenalty": prePenalty,
					"topP": topP,
					"theRequest": theText
			},
			"subtitle": `Continue in dialog, do not reset context, and use "${chatModel}."`
		},
		"alt": {
			"valid": true,	
			"variables": {
				"kikiMods": 4,
				"kikiType": "replaceAll",
				"contextProcess": "reset",
				"chatModel": chatModel,
				"chatSystem": chatSystem,
				"temperature": temperature,
				"maxTokens": maxTokens,
				"frePenalty": frePenalty,
				"prePenalty": prePenalty,
				"topP": topP,
				"theRequest": theText
			},
			"subtitle": `Paste in frontmost app, reset context, and use "${chatModel}."`
		},
		"shift": {
			"valid": true,
			"variables": {
				"kikiMods": 5,
				"kikiType": "dialogChat",
				"contextProcess": "reset",
				"chatModel": chatModel,
				"chatSystem": chatSystem,
				"temperature": temperature,
				"maxTokens": maxTokens,
				"frePenalty": frePenalty,
				"prePenalty": prePenalty,
				"topP": topP,
				"theRequest": theText
			},
			"subtitle": `Continue in dialog, reset context, and use "${chatModel}."`
		},
		"fn": {
			"valid": true,
			"variables": {
				"kikiMods": 6,
				"kikiType": fnType,
				"contextProcess": "reset",
				"chatModel": chatModel,
				"chatSystem": chatSystem,
				"temperature": temperature,
				"maxTokens": maxTokens,
				"frePenalty": frePenalty,
				"prePenalty": prePenalty,
				"topP": topP,
				"theRequest": theText
			},
			"subtitle": fn6
		},
		"cmd+ctrl": {
			"valid": true,
			"variables": {
				"kikiMods": 7,
				"kikiType": "dialogChat",
				"chatAlt": "Yes",
				"contextProcess": "original",
				"chatSystem": chatSystem,
				"temperature": temperature,
				"maxTokens": maxTokens,
				"frePenalty": frePenalty,
				"prePenalty": prePenalty,
				"topP": topP,
				"theRequest": theText
			},
			"subtitle": `Continue in dialog, do not reset context, and use "${chatModelB}."`
		},
		"cmd+alt": {
			"valid": true,
			"variables": {
				"kikiMods": 8,
				"kikiType": "replaceAll",
				"contextProcess": "reset",
				"chatAlt": "Yes",
				"chatSystem": chatSystem,
				"temperature": temperature,
				"maxTokens": maxTokens,
				"frePenalty": frePenalty,
				"prePenalty": prePenalty,
				"topP": topP,
				"theRequest": theText
			},
			"subtitle": `Paste in frontmost app, reset context, and use "${chatModelB}."`
		},
		"cmd+shift": {
			"valid": true,
			"variables": {
				"kikiMods": 9,
				"kikiType": "dialogChat",
				"contextProcess": "reset",
				"chatAlt": "Yes",
				"chatSystem": chatSystem,
				"temperature": temperature,
				"maxTokens": maxTokens,
				"frePenalty": frePenalty,
				"prePenalty": prePenalty,
				"topP": topP,
				"theRequest": theText
				
			},
			"subtitle": `Continue in dialog, reset context, and use "${chatModelB}."`
		},
		"cmd+fn": {
			"valid": true,
			"variables": {
				"kikiMods": 10,
				"kikiType": fnType,
				"contextProcess": "reset",
				"chatAlt": "Yes",
				"chatSystem": chatSystem,
				"temperature": temperature,
				"maxTokens": maxTokens,
				"frePenalty": frePenalty,
				"prePenalty": prePenalty,
				"topP": topP,
				"theRequest": theText
			},
			"subtitle": fn10
		},
		"ctrl+alt": {
			"valid": true,
			"variables": {
				"kikiMods": 11,
				"kikiType": "replaceAll",
				"contextProcess": "original",
				"chatModel": chatModel,
				"chatSystem": chatSystem,
				"temperature": temperature,
				"maxTokens": maxTokens,
				"frePenalty": frePenalty,
				"prePenalty": prePenalty,
				"topP": topP,
				"theRequest": theText
			},
			"subtitle": `Paste in frontmost app, do not reset context, and use "${chatModel}."`
		},
		"ctrl+shift": {
			"valid": true,
			"variables": {
				"kikiMods": 12,
				"kikiType": "dialogChat",
				"contextProcess": "original",
				"chatModel": chatModel,
				"chatSystem": chatSystem,
				"temperature": temperature,
				"maxTokens": maxTokens,
				"frePenalty": frePenalty,
				"prePenalty": prePenalty,
				"topP": topP,
				"theRequest": theText
			},
			"subtitle": `Continue in dialog, do not reset context, and use "${chatModel}."`
		},
		"ctrl+fn": {
			"valid": true,
			"variables": {
				"kikiMods": 13,
				"kikiType": fnType,
				"contextProcess": "original",
				"chatModel": chatModel,
				"chatSystem": chatSystem,
				"temperature": temperature,
				"maxTokens": maxTokens,
				"frePenalty": frePenalty,
				"prePenalty": prePenalty,
				"topP": topP,
				"theRequest": theText
			},
			"subtitle": fn13
		},
		"cmd+ctrl+alt": {
			"valid": true,
			"variables": {
				"kikiMods": 14,
				"kikiType": "replaceAll",
				"chatAlt": "Yes",
				"contextProcess": "original",
				"chatSystem": chatSystem,
				"temperature": temperature,
				"maxTokens": maxTokens,
				"frePenalty": frePenalty,
				"prePenalty": prePenalty,
				"topP": topP,
				"theRequest": theText
			},
			"subtitle": `Paste in frontmost app, do not reset context, and use "${chatModelB}."`
		},
		"cmd+ctrl+shift": {
			"valid": true,
			"variables": {
				"kikiMods": 15,
				"kikiType": "dialogChat",
				"chatAlt": "Yes",
				"contextProcess": "original",
				"chatSystem": chatSystem,
				"temperature": temperature,
				"maxTokens": maxTokens,
				"frePenalty": frePenalty,
				"prePenalty": prePenalty,
				"topP": topP,
				"theRequest": theText
			},
			"subtitle": `Continue in dialog, do not reset context, and use "${chatModelB}."`
		},
		"cmd+ctrl+fn": {
			"valid": true,
			"variables": {
				"kikiMods": 16,
				"kikiType": fnType,
				"chatAlt": "Yes",
				"contextProcess": "original",
				"chatSystem": chatSystem,
				"temperature": temperature,
				"maxTokens": maxTokens,
				"frePenalty": frePenalty,
				"prePenalty": prePenalty,
				"topP": topP,
				"theRequest": theText
			},
			"subtitle": fn16
		},
		"shift+fn": {
			"valid": true,
			"variables": {
				"kikiMods": 17,
				"kikiType": "dialogChat",
				"chatAlt": "List",
				"contextProcess": "reset",
				"chatSystem": chatSystem,
				"temperature": temperature,
				"maxTokens": maxTokens,
				"frePenalty": frePenalty,
				"prePenalty": prePenalty,
				"topP": topP,
				"theRequest": theText
			},
			"subtitle": `Continue in dialog, reset context, and choose a model from the preset list.`
		},
		"shift+fn+alt": {
			"valid": true,
			"variables": {
				"kikiMods": 18,
				"kikiType": "replaceAll",
				"chatAlt": "List",
				"contextProcess": "reset",
				"chatSystem": chatSystem,
				"temperature": temperature,
				"maxTokens": maxTokens,
				"frePenalty": frePenalty,
				"prePenalty": prePenalty,
				"topP": topP,
				"theRequest": theText
			},
			"subtitle": `Paste in frontmost app, reset context, and choose a model from the preset list.`
		},
		"shift+fn+ctrl": {
			"valid": true,
			"variables": {
				"kikiMods": 19,
				"kikiType": "dialogChat",
				"chatAlt": "List",
				"contextProcess": "original",
				"chatSystem": chatSystem,
				"temperature": temperature,
				"maxTokens": maxTokens,
				"frePenalty": frePenalty,
				"prePenalty": prePenalty,
				"topP": topP,
				"theRequest": theText
			},
			"subtitle": `Continue in dialog, do not reset context, and choose a model from the preset list.`
		},
		"shift+fn+cmd": {
			"valid": true,
			"variables": {
				"kikiMods": 20,
				"kikiType": fnType,
				"chatAlt": "List",
				"contextProcess": "reset",
				"chatSystem": chatSystem,
				"temperature": temperature,
				"maxTokens": maxTokens,
				"frePenalty": frePenalty,
				"prePenalty": prePenalty,
				"topP": topP,
				"theRequest": theText
			},
			"subtitle": fn20
		},
		"shift+fn+ctrl+alt": {
			"valid": true,
			"variables": {
				"kikiMods": 21,
				"kikiType": "replaceAll",
				"chatAlt": "List",
				"contextProcess": "original",
				"chatSystem": chatSystem,
				"temperature": temperature,
				"maxTokens": maxTokens,
				"frePenalty": frePenalty,
				"prePenalty": prePenalty,
				"topP": topP,
				"theRequest": theText
			},
			"subtitle": `Paste in frontmost app, do not reset context, and choose a model from the preset list.`
		},
		"shift+fn+cmd+ctrl": {
			"valid": true,
			"variables": {
				"kikiMods": 22,
				"kikiType": fnType,
				"chatAlt": "List",
				"contextProcess": "original",
				"chatSystem": chatSystem,
				"temperature": temperature,
				"maxTokens": maxTokens,
				"frePenalty": frePenalty,
				"prePenalty": prePenalty,
				"topP": topP,
				"theRequest": theText
			},
			"subtitle": fn22
		}
	};

	// Function to for mods and theSub
	function deepClone(obj) {
		return JSON.parse(JSON.stringify(obj));
	}

    // Function to read JSON file and parse it
	function readAndProcessJSON(filePath) {
		const fileManager = $.NSFileManager.defaultManager;
		if (fileManager.fileExistsAtPath(filePath)) {
			const content = $.NSString.stringWithContentsOfFileEncodingError(filePath, $.NSUTF8StringEncoding, null);
			const json = JSON.parse(content.js);
			return json.map(item => {
				const processedPrompt = item['thePrompt'].replace('[[txt]]', theText);
				let localMods = deepClone(mods); // Create a deep copy of mods for local modification
				let localSub = deepClone(theSub);
				let localFn6 = deepClone(fn6);
				let localFn13 = deepClone(fn13);

            	// Check if chatModel exists in the current item and modify localMods accordingly
				if (item.M) {
					if (theText !== '') {
						if (kikiMods === '') {
							localSub = `Continue in dialog, reset context, and use "${item.M}."`;
						}
						localFn6 = `Insert below, reset context, and use "${item.M}."`;
						localFn13 = `Insert below, do not reset context, and use "${item.M}."`;
					} else {
						localFn6 = `Continue in dialog, reset context, and use "${item.M}."`;
						localFn13 = `Continue in dialog, do not reset context, and use "${item.M}."`;
					}
					if (kikiMods === 1) {
						localSub = `Continue in dialog, reset context, and use "${item.M}."`;
					} else if (kikiMods === 3) {
						localSub = `Continue in dialog, do not reset context, and use "${item.M}."`;
					} else if (kikiMods === 4) {
						localSub = `Paste in frontmost app, reset context, and use "${item.M}."`;
					} else if (kikiMods === 5) {
						localSub = `Continue in dialog, reset context, and use "${item.M}."`;
					} else if (kikiMods === 6) {
						localSub = localFn6;
					} else if (kikiMods === 11) {
						localSub = `Paste in frontmost app, do not reset context, and use "${item.M}."`;
					} else if (kikiMods === 12) {
						localSub = `Continue in dialog, do not reset context, and use "${item.M}."`;
					} else if (kikiMods === 13) {
						localSub = localFn13;
					}
					localMods.ctrl.subtitle = `Continue in dialog, do not reset context, and use "${item.M}."`
					localMods.alt.subtitle = `Paste in frontmost app, reset context, and use "${item.M}."`
					localMods.shift.subtitle = `Continue in dialog, reset context, and use "${item.M}."`
					localMods.fn.subtitle = localFn6
					localMods['ctrl+alt'].subtitle = `Paste in frontmost app, do not reset context, and use "${item.M}."`
					localMods['ctrl+shift'].subtitle = `Continue in dialog, do not reset context, and use "${item.M}."`
					localMods['ctrl+fn'].subtitle = localFn13
					localMods.ctrl.variables.chatModel = item.M
					localMods.alt.variables.chatModel = item.M
					localMods.shift.variables.chatModel = item.M
					localMods.fn.variables.chatModel = item.M
					localMods['ctrl+alt'].variables.chatModel = item.M
					localMods['ctrl+shift'].variables.chatModel = item.M
					localMods['ctrl+fn'].variables.chatModel = item.M
				}
				if (item.S) {
					localMods.cmd.variables.chatSystem = item.S
					localMods.ctrl.variables.chatSystem = item.S
					localMods.alt.variables.chatSystem = item.S
					localMods.shift.variables.chatSystem = item.S
					localMods.fn.variables.chatSystem = item.S
					localMods['cmd+ctrl'].variables.chatSystem = item.S
					localMods['cmd+alt'].variables.chatSystem = item.S
					localMods['cmd+shift'].variables.chatSystem = item.S
					localMods['cmd+fn'].variables.chatSystem = item.S
					localMods['ctrl+alt'].variables.chatSystem = item.S
					localMods['ctrl+shift'].variables.chatSystem = item.S
					localMods['ctrl+fn'].variables.chatSystem = item.S
					localMods['cmd+ctrl+alt'].variables.chatSystem = item.S
					localMods['cmd+ctrl+shift'].variables.chatSystem = item.S
					localMods['cmd+ctrl+fn'].variables.chatSystem = item.S
					localMods['shift+fn'].variables.chatSystem = item.S
					localMods['shift+fn+alt'].variables.chatSystem = item.S
					localMods['shift+fn+ctrl'].variables.chatSystem = item.S
					localMods['shift+fn+cmd'].variables.chatSystem = item.S
					localMods['shift+fn+ctrl+alt'].variables.chatSystem = item.S
					localMods['shift+fn+cmd+ctrl'].variables.chatSystem = item.S
				}
				if (item.T) {
					localMods.cmd.variables.temperature = item.T
					localMods.ctrl.variables.temperature = item.T
					localMods.alt.variables.temperature = item.T
					localMods.shift.variables.temperature = item.T
					localMods.fn.variables.temperature = item.T
					localMods['cmd+ctrl'].variables.temperature = item.T
					localMods['cmd+alt'].variables.temperature = item.T
					localMods['cmd+shift'].variables.temperature = item.T
					localMods['cmd+fn'].variables.temperature = item.T
					localMods['ctrl+alt'].variables.temperature = item.T
					localMods['ctrl+shift'].variables.temperature = item.T
					localMods['ctrl+fn'].variables.temperature = item.T
					localMods['cmd+ctrl+alt'].variables.temperature = item.T
					localMods['cmd+ctrl+shift'].variables.temperature = item.T
					localMods['cmd+ctrl+fn'].variables.temperature = item.T
					localMods['shift+fn'].variables.temperature = item.T
					localMods['shift+fn+alt'].variables.temperature = item.T
					localMods['shift+fn+ctrl'].variables.temperature = item.T
					localMods['shift+fn+cmd'].variables.temperature = item.T
					localMods['shift+fn+ctrl+alt'].variables.temperature = item.T
					localMods['shift+fn+cmd+ctrl'].variables.temperature = item.T
				}
				if (item.X) {
					localMods.cmd.variables.maxTokens = item.X
					localMods.ctrl.variables.maxTokens = item.X
					localMods.alt.variables.maxTokens = item.X
					localMods.shift.variables.maxTokens = item.X
					localMods.fn.variables.maxTokens = item.X
					localMods['cmd+ctrl'].variables.maxTokens = item.X
					localMods['cmd+alt'].variables.maxTokens = item.X
					localMods['cmd+shift'].variables.maxTokens = item.X
					localMods['cmd+fn'].variables.maxTokens = item.X
					localMods['ctrl+alt'].variables.maxTokens = item.X
					localMods['ctrl+shift'].variables.maxTokens = item.X
					localMods['ctrl+fn'].variables.maxTokens = item.X
					localMods['cmd+ctrl+alt'].variables.maxTokens = item.X
					localMods['cmd+ctrl+shift'].variables.maxTokens = item.X
					localMods['cmd+ctrl+fn'].variables.maxTokens = item.X
					localMods['shift+fn'].variables.maxTokens = item.T
					localMods['shift+fn+alt'].variables.maxTokens = item.T
					localMods['shift+fn+ctrl'].variables.maxTokens = item.T
					localMods['shift+fn+cmd'].variables.maxTokens = item.T
					localMods['shift+fn+ctrl+alt'].variables.maxTokens = item.T
					localMods['shift+fn+cmd+ctrl'].variables.maxTokens = item.T
				}
				if (item.F) {
					localMods.cmd.variables.frePenalty = item.F
					localMods.ctrl.variables.frePenalty = item.F
					localMods.alt.variables.frePenalty = item.F
					localMods.shift.variables.frePenalty = item.F
					localMods.fn.variables.frePenalty = item.F
					localMods['cmd+ctrl'].variables.frePenalty = item.F
					localMods['cmd+alt'].variables.frePenalty = item.F
					localMods['cmd+shift'].variables.frePenalty = item.F
					localMods['cmd+fn'].variables.frePenalty = item.F
					localMods['ctrl+alt'].variables.frePenalty = item.F
					localMods['ctrl+shift'].variables.frePenalty = item.F
					localMods['ctrl+fn'].variables.frePenalty = item.F
					localMods['cmd+ctrl+alt'].variables.frePenalty = item.F
					localMods['cmd+ctrl+shift'].variables.frePenalty = item.F
					localMods['cmd+ctrl+fn'].variables.frePenalty = item.F
					localMods['shift+fn'].variables.frePenalty = item.F
					localMods['shift+fn+alt'].variables.frePenalty = item.F
					localMods['shift+fn+ctrl'].variables.frePenalty = item.F
					localMods['shift+fn+cmd'].variables.frePenalty = item.F
					localMods['shift+fn+ctrl+alt'].variables.frePenalty = item.F
					localMods['shift+fn+cmd+ctrl'].variables.frePenalty = item.F
				}
				if (item.P) {
					localMods.cmd.variables.prePenalty = item.P
					localMods.ctrl.variables.prePenalty = item.P
					localMods.alt.variables.prePenalty = item.P
					localMods.shift.variables.prePenalty = item.P
					localMods.fn.variables.prePenalty = item.P
					localMods['cmd+ctrl'].variables.prePenalty = item.P
					localMods['cmd+alt'].variables.prePenalty = item.P
					localMods['cmd+shift'].variables.prePenalty = item.P
					localMods['cmd+fn'].variables.prePenalty = item.P
					localMods['ctrl+alt'].variables.prePenalty = item.P
					localMods['ctrl+shift'].variables.prePenalty = item.P
					localMods['ctrl+fn'].variables.prePenalty = item.P
					localMods['cmd+ctrl+alt'].variables.prePenalty = item.P
					localMods['cmd+ctrl+shift'].variables.prePenalty = item.P
					localMods['cmd+ctrl+fn'].variables.prePenalty = item.P
					localMods['shift+fn'].variables.prePenalty = item.P
					localMods['shift+fn+alt'].variables.prePenalty = item.P
					localMods['shift+fn+ctrl'].variables.prePenalty = item.P
					localMods['shift+fn+cmd'].variables.prePenalty = item.P
					localMods['shift+fn+ctrl+alt'].variables.prePenalty = item.P
					localMods['shift+fn+cmd+ctrl'].variables.prePenalty = item.P
				}
				if (item.O) {
					localMods.cmd.variables.topP = item.O
					localMods.ctrl.variables.topP = item.O
					localMods.alt.variables.topP = item.O
					localMods.shift.variables.topP = item.O
					localMods.fn.variables.topP = item.O
					localMods['cmd+ctrl'].variables.topP = item.O
					localMods['cmd+alt'].variables.topP = item.O
					localMods['cmd+shift'].variables.topP = item.O
					localMods['cmd+fn'].variables.topP = item.O
					localMods['ctrl+alt'].variables.topP = item.O
					localMods['ctrl+shift'].variables.topP = item.O
					localMods['ctrl+fn'].variables.topP = item.O
					localMods['cmd+ctrl+alt'].variables.topP = item.O
					localMods['cmd+ctrl+shift'].variables.topP = item.O
					localMods['cmd+ctrl+fn'].variables.topP = item.O
					localMods['shift+fn'].variables.topP = item.O
					localMods['shift+fn+alt'].variables.topP = item.O
					localMods['shift+fn+ctrl'].variables.topP = item.O
					localMods['shift+fn+cmd'].variables.topP = item.O
					localMods['shift+fn+ctrl+alt'].variables.topP = item.O
					localMods['shift+fn+cmd+ctrl'].variables.topP = item.O
				}
				localMods.cmd.variables.theRequest = processedPrompt
				localMods.ctrl.variables.theRequest = processedPrompt
				localMods.alt.variables.theRequest = processedPrompt
				localMods.shift.variables.theRequest = processedPrompt
				localMods.fn.variables.theRequest = processedPrompt
				localMods['cmd+ctrl'].variables.theRequest = processedPrompt
				localMods['cmd+alt'].variables.theRequest = processedPrompt
				localMods['cmd+shift'].variables.theRequest = processedPrompt
				localMods['cmd+fn'].variables.theRequest = processedPrompt
				localMods['ctrl+alt'].variables.theRequest = processedPrompt
				localMods['ctrl+shift'].variables.theRequest = processedPrompt
				localMods['ctrl+fn'].variables.theRequest = processedPrompt
				localMods['cmd+ctrl+alt'].variables.theRequest = processedPrompt
				localMods['cmd+ctrl+shift'].variables.theRequest = processedPrompt
				localMods['cmd+ctrl+fn'].variables.theRequest = processedPrompt
				localMods['shift+fn'].variables.theRequest = processedPrompt
				localMods['shift+fn+alt'].variables.theRequest = processedPrompt
				localMods['shift+fn+ctrl'].variables.theRequest = processedPrompt
				localMods['shift+fn+cmd'].variables.theRequest = processedPrompt
				localMods['shift+fn+ctrl+alt'].variables.theRequest = processedPrompt
				localMods['shift+fn+cmd+ctrl'].variables.theRequest = processedPrompt
                return {
                    "uid": item.id,
                    "type": "default",
                    "title": item.theTitle + indicator,
                    "subtitle": localSub,
                    "arg": item.id,
                    "autocomplete": item.theTitle,
                    "variables": {
                        "theRequest": processedPrompt,
						"kikiType": kikiType,
						"contextProcess": contextProcess,
						"chatModel": item.M ? item.M : chatModel,
						"chatSystem": item.S ? item.S : chatSystem,
						"temperature": item.T ? item.T : temperature,
						"maxTokens": item.X ? item.X : maxTokens,
						"frePenalty": item.F ? item.F : frePenalty,
						"prePenalty": item.P ? item.P : prePenalty,
						"topP": item.O ? item.O : topP
                    },
					"mods": localMods
                };
            });
        }
        return [];
    }

    let importedItems = readAndProcessJSON(`${wfPath}/assets/kiki_text.json`);
    const additionalItemsPath = `${dataPath}/presets/text.json`;
    if ($.NSFileManager.defaultManager.fileExistsAtPath(additionalItemsPath)) {
        importedItems = importedItems.concat(readAndProcessJSON(additionalItemsPath));
    }

	let conditionalItems = [];
	if (theText !== '') {
	  conditionalItems.push({
		"uid": "customPrompt",
		"type": "default",
		"title": "Add a Custom Prompt" + indicator,
		"subtitle": theSub,
		"autocomplete": "Add a Custom Prompt",
		"arg": "customPrompt",
		"variables": {
			"kikiType": kikiType
		},
		"mods": mods
	  },{
		"uid": "useAsPrompt",
		"type": "default",
		"title": "Use as Prompt" + indicator,
		"subtitle": theSub,
		"autocomplete": "Use as Prompt",
		"arg": "useAsPrompt",
		"variables": {
			"theRequest": theText,
			"kikiType": kikiType
		},
		"mods": mods
	  });
	}

	const scriptFilterItem = {
		"items": [
			...conditionalItems,
			...importedItems
		]
	};

	return JSON.stringify(scriptFilterItem);
}