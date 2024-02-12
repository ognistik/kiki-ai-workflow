ObjC.import('stdlib');
ObjC.import('Foundation');
ObjC.import('AppKit');

// kikiCopy can be: copy, snippet, incoming, custom (custom = requires input)
// kikiMenu can be: menu or direct
// menu,copy,4 works
// menu,custom,4 works
// custom,direct,4,translateEn ???? makes no sense...

function run(argv) {
    const kikiMenu = $.getenv('kikiSplit1');
    const delayClipboard = $.getenv('_delayClipboard');
    const kikiMods = parseInt($.getenv('kikiSplit3'), 10);
    var fromAlfred = $.getenv('kiki_data');
    const dataPath = fromAlfred;
    const wfPath = $.NSFileManager.defaultManager.currentDirectoryPath.js;
    let chatModel = $.getenv('chatModel');
    let chatSystem = $.getenv('chatSystem');
    let contextProcess = "original";
    let kikiType = "";
    let customPromptText;
    let chatAlt;
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
        kikiCopy = $.getenv('kikiSplit2');
    } catch (error) {
        kikiCopy = '';
    }
    try {
        theAction = $.getenv('kikiSplit4');
    } catch (error) {
        theAction = '';
    }

    if (kikiCopy === "copy" || kikiCopy === "snippet" || kikiCopy === "incoming") {
        fnType = "insertBelow";
    } else {
        fnType = "dialogChat";
    }

    if (kikiMods === 1) {
        kikiType = "dialogChat";
        contextProcess = "reset";
    } else if (kikiMods === 2) {
        kikiType = "dialogChat";
        chatAlt = "yes";
        contextProcess = "reset";
    } else if (kikiMods === 3) {
		kikiType = "dialogChat";
        contextProcess = "original";
	} else if (kikiMods === 4) {
		kikiType = "replaceAll";
        contextProcess = "reset";
	} else if (kikiMods === 5) {
		kikiType = "dialogChat";
        contextProcess = "reset";
	} else if (kikiMods === 6) {
		kikiType = fnType;
        contextProcess = "reset";
	} else if (kikiMods === 7) {
		kikiType = "dialogChat";
        chatAlt = "yes";
        contextProcess = "original";
	} else if (kikiMods === 8) {
		kikiType = "replaceAll";
        chatAlt = "yes";
        contextProcess = "reset";
	} else if (kikiMods === 9) {
		kikiType = "dialogChat";
        chatAlt = "yes";
        contextProcess = "reset";
	} else if (kikiMods === 10) {
		kikiType = fnType;
        chatAlt = "yes";
        contextProcess = "reset";
	} else if (kikiMods === 11) {
		kikiType = "replaceAll";
        contextProcess = "original";
	} else if (kikiMods === 12) {
		kikiType = "dialogChat";
        contextProcess = "original";
	} else if (kikiMods === 13) {
		kikiType = fnType;
        contextProcess = "original";
	} else if (kikiMods === 14) {
		kikiType = "replaceAll";
        chatAlt = "yes";
        contextProcess = "original";
	} else if (kikiMods === 15) {
		kikiType = "dialogChat";
        chatAlt = "yes";
        contextProcess = "original";
	} else if (kikiMods === 16) {
		kikiType = fnType;
        chatAlt = "yes";
        contextProcess = "original";
	}

Application('System Events').includeStandardAdditions = true; // Include to use 'delay'

function simulateKeystroke(keys, options) {
    const systemEvents = Application('System Events');
    systemEvents.keystroke(keys, options);
}

function copyFromClipboard() {
    return $.NSPasteboard.generalPasteboard.stringForType($.NSPasteboardTypeString).js;
}

function delay(seconds) {
    $.NSThread.sleepForTimeInterval(seconds);
}

function handleKikiCopy() {
    if (kikiCopy === 'copy') {
        // Simulate CMD+C to copy
        simulateKeystroke('c', { using: 'command down' });
        delay(delayClipboard); // Adjust delay as needed
        theText = copyFromClipboard();
    } else if (kikiCopy === 'snippet') {
        // Simulate CTRL+SHIFT+A to select a snippet (customize as needed)
        simulateKeystroke('a', { using: ['control down', 'shift down'] });
        delay(delayClipboard);
        // Then copy
        simulateKeystroke('c', { using: 'command down' });
        delay(delayClipboard);
        theText = copyFromClipboard();
    } else if (kikiCopy === 'incoming') {
        theText = copyFromClipboard();
    }
}

if (theText === '' && kikiCopy !== 'custom' && kikiCopy !== '-') { // When will it be -?
    handleKikiCopy();
}

// Function to read and process JSON file, adapted for your requirements
function readAndFindAction(filePath, theAction, userText) {
    const fileManager = $.NSFileManager.defaultManager;
    if (fileManager.fileExistsAtPath(filePath)) {
        const content = $.NSString.stringWithContentsOfFileEncodingError(filePath, $.NSUTF8StringEncoding, null);
        const actions = JSON.parse(content.js); // Parse the JSON content

        // Find the action by uid
        const action = actions.find(action => action.id === theAction);
        if (action) {
            // Initialize an object to hold our results
            let result = {
                theRequest: action.thePrompt.replace('[[txt]]', userText), // Replace [[txt]] with userText in thePrompt
            };

            // Check for chatModel and chatSystem keys and add them to the result object if present
            if (action.M) {
                result.chatModel = action.M;
            }
            if (action.S) {
                result.chatSystem = action.S;
            }
            if (action.T) {
                result.temperature = action.T;
            }
            if (action.X) {
                result.maxTokens = action.X;
            }
            if (action.F) {
                result.frePenalty = action.F;
            }
            if (action.P) {
                result.prePenalty = action.P;
            }
            if (action.O) {
                result.topP = action.O;
            }

            return result;
        }
    }
    return null; // Return null if file doesn't exist or action not found
}

// Assuming wfPath, dataPath, theAction, and theText are already defined
const kikiActionsPath = `${wfPath}/assets/kiki_text.json`;
const userActionsPath = `${dataPath}/presets/text.json`;

// Special handling for "customPrompt" action
if (theAction === "customPrompt") {
    theRequest = "";
    customPromptText = theText;
    theText = "";
} else if (theAction === "useAsPrompt") {
    theRequest = theText;
} else {
    // Attempt to find the action in kiki_text.json
    let result = readAndFindAction(kikiActionsPath, theAction, theText);

    // If not found in kiki_actions.json, try in text.json
    if (result === null) {
        result = readAndFindAction(userActionsPath, theAction, theText);
    }

    // If result is still null, handle the case where the action wasn't found in either file
    if (result === null) {
        theRequest = '-'; // Or handle as needed
    } else {
        theRequest = result.theRequest;
        chatModel = result.chatModel || chatModel; // Assign chatModel if it exists
        chatSystem = result.chatSystem || chatSystem; // Assign chatSystem if it exists
        temperature = result.temperature || temperature;
        maxTokens = result.maxTokens || maxTokens;
        frePenalty = result.frePenalty || frePenalty;
        prePenalty = result.prePenalty || prePenalty;
        topP = result.topP || topP;
    }
}

const output = {
    alfredworkflow: {
        arg: "",
        variables: {
            chatModel: chatModel,
            chatSystem: chatSystem,
            temperature: temperature,
            maxTokens: maxTokens,
            frePenalty: frePenalty,
            prePenalty: prePenalty,
            topP: topP,
            kikiType: kikiType,
            contextProcess: contextProcess,
            chatAlt: chatAlt,
            theRequest: theRequest,
            customPromptText: customPromptText,
            theAction: theAction,
            theText: theText,
            kikiMods: kikiMods,
            kikiCopy: kikiCopy,
            kikiMenu: kikiMenu
        }
    }
};

return JSON.stringify(output);
}