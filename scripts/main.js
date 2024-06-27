ObjC.import('stdlib');
ObjC.import('Foundation');

function run(argv) {
	var theDir = $.getenv('kiki_data');
	var chatModelB = $.getenv('chatModelB');
	let dataDir = theDir;
	let context = "";
	let lastResponse = "";
	let lastTranscription = "";
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

	let transcriptionFilePath = $(dataDir + '/lastTranscription.txt').stringByExpandingTildeInPath;
	if (fileManager.fileExistsAtPath(transcriptionFilePath)) {
		lastTranscription = transcriptionFilePath.js;
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

	try {
		oaiToken = $.getenv('APIToken_OAI');
	} catch (error) {
		oaiToken = "";
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
			...(oaiToken !== '' ? [{
				"uid": "whisperTranscribe",
				"type": "default",
				"title": "Whisper AI Transcription",
				"subtitle": "Record audio and transcribe it.",
				"arg": "actionWhisper",
				"variables": {
					"kikiSplit2": "whisper"
				},
				"autocomplete": "Whisper AI Transcription",
				"mods": {
					"cmd": {
						"valid": true,
						"arg": "actionWhisper",
						"variables": {
							"kikiSplit1": "direct",
							"kikiSplit2": "whisper",
							"kikiSplit3": "1",
							"kikiSplit4": "useAsPrompt"
						},
						"subtitle": "Record audio and use it as prompt for chat."
					},
					"alt": {
						"valid": true,
						"arg": "actionWhisper",
						"variables": {
							"kikiSplit1": "paste",
							"kikiSplit2": "whisper"
						},
						"subtitle": "Record audio and paste transcripion in frontmost app."
					},
					"shift": {
						"valid": true,
						"arg": "actionWhisper",
						"variables": {
							"kikiSplit1": "menu",
							"kikiSplit2": "whisper",
							"kikiSplit3": "1"
						},
						"subtitle": "Record audio and run transcription through preset."
					}
				}
			}] : []),
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
						"arg": "actionResumeLast",
						"subtitle": `Defaults to dialog responses and will use "${chatModelB}."`,
						"variables": {
							"theContext": context,
							"chatModel": chatModelB
						}
					},
					"fn+shift": {
						"valid": true,
						"arg": "actionResumeLast",
						"subtitle": "Defaults to dialog responses and will prompt user for a model from the preset list.",
						"variables": {
							"theContext": context,
							"chatAlt": "List"
						}
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
			...(lastTranscription !== '' ? [{
				"uid": "copyTrans",
				"type": "default",
				"title": "Copy Last Transcription",
				"subtitle": "Copy last transcription text to your clipboard.",
				"arg": "filesCopyTranscription",
				"autocomplete": "Copy Last Transcription",
				"mods": {
					"cmd": {
						"valid": true,
						"arg": "filesRevealPath",
						"subtitle": "Reveal data & history path in Finder."
					}
				},
				"quicklookurl": lastTranscription
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