ObjC.import('stdlib');
ObjC.import('Foundation');

function run(argv) {
	var theDir = $.getenv('kiki_data');
	let dataDir = theDir;
	let context = "";
	let lastResponse = "";
	let kikiHistory = "";
	let lastModel = "";

	let fileManager = $.NSFileManager.defaultManager;
	let historyDirPath = $(dataDir + '/history').stringByExpandingTildeInPath;
	let isDir = Ref();

	if (fileManager.fileExistsAtPathIsDirectory(historyDirPath, isDir) && isDir[0]) {
		let directoryContents = fileManager.contentsOfDirectoryAtPathError(historyDirPath, null);
		if (directoryContents && directoryContents.js.length > 1) {
			kikiHistory = dataDir + '/history';
		}
	}
	
	let contextFilePath = $(dataDir + '/context.json').stringByExpandingTildeInPath;
	if (fileManager.fileExistsAtPath(contextFilePath)) {
		context = contextFilePath.js;
	}
	
	let responseFilePath = $(dataDir + '/lastResponse.txt').stringByExpandingTildeInPath;
	if (fileManager.fileExistsAtPath(responseFilePath)) {
		lastResponse = responseFilePath.js;
	}
	
	var app = Application.currentApplication();
	app.includeStandardAdditions = true;
	let modelFilePath = $(dataDir + '/lastModel.txt').stringByExpandingTildeInPath;
	let shellCommandToReadFile = `cat '${modelFilePath.js}'`; // Ensure the path is properly quoted
	try {
		// Using doShellScript to read the file content
		lastModel = app.doShellScript(shellCommandToReadFile);
	} catch (error) {
		lastModel = "";
	}	

	try {
		copyContextPath = $.getenv('copyContextPath');
	} catch (error) {
		copyContextPath = "";
	}


	function escapeForJSON(value) {
		return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
	  }
	const scriptFilterItems = {
		"items": [
			{
				"uid": "textPresets",
				"type": "default",
				"title": "Text Presets",
				"subtitle": "Custom AI text utilities.",
				"arg": "actionPresets",
				"autocomplete": "Text Presets",
				"mods": {
					"cmd": {
						"valid": true,
						"arg": "filesRevealPath",
						"subtitle": "Reveal data & history path in Finder."
					}
				}
			},
			{
				"uid": "quickChat",
				"type": "default",
				"title": "Quick Chat",
				"subtitle": "Start a chat from within Alfred's bar, defaults to dialog responses.",
				"arg": "actionChat",
				"autocomplete": "Quick Chat",
				"mods": {
					"cmd": {
						"valid": true,
						"arg": "filesRevealPath",
						"subtitle": "Reveal data & history path in Finder."
					}
				}
			},
			...(context !== '' ? [{
				"uid": "resumeLast",
				"type": "default",
				"title": "Resume Last Chat",
				"subtitle": `Defaults to dialog responses and will use "${lastModel}."`,
				"arg": "actionResumeLast",
				"autocomplete": "Resume Last Chat",
				"variables": {
					"theContext": context,
					"chatModel": lastModel
				},
				"mods": {
					"cmd": {
						"valid": true,
						"arg": "filesRevealPath",
						"subtitle": "Reveal data & history path in Finder."
					}
				},
				"quicklookurl": context
			}] : []),
			...(lastResponse !== '' ? [{
				"uid": "copyLast",
				"type": "default",
				"title": "Copy Last Response",
				"subtitle": "Copy last response text to your clipboard.",
				"arg": "filesCopyResponse",
				"autocomplete": "Copy Last Response",
				"mods": {
					"cmd": {
						"valid": true,
						"arg": "filesRevealPath",
						"subtitle": "Reveal data & history path in Finder."
					}
				},
				"quicklookurl": lastResponse
			  }] : []),
			...(context !== '' && copyContextPath !== '' ? [{
				"uid": "copyContext",
				"type": "default",
				"title": "Copy Most Recent Context File",
				"subtitle": "Copy context file to your specified path.",
				"arg": "filesCopyContext",
				"autocomplete": "Copy Most Recent Context File",
				"mods": {
					"cmd": {
						"valid": true,
						"arg": "filesRevealPath",
						"subtitle": "Reveal data & history path in Finder."
					}
				},
				"quicklookurl": context
			}] : []),
			...(context !== '' ? [{
				"uid": "resetLogs",
				"type": "default",
				"title": "Reset Logs",
				"subtitle": "Clears existing context file, saved logs, and history.",
				"arg": "filesResetLogs",
				"autocomplete": "Reset Logs",
				"mods": {
					"cmd": {
						"valid": true,
						"arg": "filesRevealPath",
						"subtitle": "Reveal data & history path in Finder."
					}
				},
				"quicklookurl": context
			}] : []),
			...(context !== '' ? [{
				"uid": "openContext",
				"type": "default",
				"title": "Open Most Recent Context File",
				"subtitle": "Be cautious when modifying the JSON format.",
				"arg": "filesOpenContext",
				"autocomplete": "Open Most Recent Context File",
				"mods": {
					"cmd": {
						"valid": true,
						"arg": "filesRevealPath",
						"subtitle": "Reveal data & history path in Finder."
					}
				},
				"quicklookurl": context
			}] : [])
		]
	};

return JSON.stringify(scriptFilterItems);
}