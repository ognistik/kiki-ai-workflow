ObjC.import('stdlib');

function run(argv) {
// first command-line argument is the user's query
const theRequest = argv[0];
const chatModel = $.getenv('chatModel');
const chatModelB = $.getenv('chatModelB');
let theTitle = "Kiki Chat";
let theSub = `Continue in dialog, reset context, and use "${chatModel}."`;
let kikiType = "dialogChat";
let fnType = "dialogChat";
let fn6 = `Continue in dialog, reset context, and use "${chatModel}."`;
let fn10 = `Continue in dialog, reset context, and use "${chatModelB}."`;
let fn13 = `Continue in dialog, do not reset context, and use "${chatModel}."`;
let fn16 = `Continue in dialog, do not reset context, and use "${chatModelB}."`;

const mods = {
    "cmd": {
        "valid": true,
        "variables": {
            "kikiType": "dialogChat",
            "theRequest": theRequest,
            "chatContext": 1,
            "chatAlt": "Yes"
        },
        "subtitle": `Continue in dialog, reset context, and use "${chatModelB}."`
    },
    "ctrl": {
        "valid": true,
        "variables": {
            "kikiType": "dialogChat",
            "theRequest": theRequest
        },
        "subtitle": `Continue in dialog, do not reset context, and use "${chatModel}."`
    },
	"alt": {
		"valid": true,
		"variables": {
		"kikiType": "replaceAll",
		"theRequest": theRequest,
		"chatContext": 1
		},
		"subtitle": `Paste in frontmost app, reset context, and use "${chatModel}."`
	},
	"shift": {
		"valid": true,
		"arg": "",
		"variables": {
		"kikiType": "dialogChat",
		"theRequest": theRequest,
		"chatContext": 1
		},
		"subtitle": `Continue in dialog, reset context, and use "${chatModel}."`
	},
	"fn": {
		"valid": true,
		"arg": "",
		"variables": {
		"kikiType": fnType,
		"theRequest": theRequest,
		"chatContext": 1
		},
		"subtitle": fn6
	},
	"cmd+ctrl": {
		"valid": true,
		"arg": "",
		"variables": {
		"kikiType": "dialogChat",
		"theRequest": theRequest,
		"chatAlt": "Yes"
		},
		"subtitle": `Continue in dialog, do not reset context, and use "${chatModelB}."`
	},
	"cmd+alt": {
		"valid": true,
		"arg": "",
		"variables": {
		"kikiType": "replaceAll",
		"theRequest": theRequest,
		"chatContext": 1,
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
		"chatContext": 1,
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
		"chatContext": 1,
		"chatAlt": "Yes"
		},
		"subtitle": fn10
	},
	"ctrl+alt": {
		"valid": true,
		"arg": "",
		"variables": {
		"kikiType": "replaceAll",
		"theRequest": theRequest
		},
		"subtitle": `Paste in frontmost app, do not reset context, and use "${chatModel}."`
	},
	"ctrl+shift": {
		"valid": true,
		"arg": "",
		"variables": {
		"kikiType": "dialogChat",
		"theRequest": theRequest
		},
		"subtitle": `Continue in dialog, do not reset context, and use "${chatModel}."`
	},
	"ctrl+fn": {
		"valid": true,
		"arg": "",
		"variables": {
		"kikiType": fnType,
		"theRequest": theRequest
		},
		"subtitle": fn13
	},
	"cmd+ctrl+alt": {
		"valid": true,
		"arg": "",
		"variables": {
		"kikiType": "replaceAll",
		"theRequest": theRequest,
		"chatAlt": "Yes"
		},
		"subtitle": `Paste in frontmost app, do not reset context, and use "${chatModelB}."`
	},
	"cmd+ctrl+shift": {
		"valid": true,
		"arg": "",
		"variables": {
		"kikiType": "dialogChat",
		"theRequest": theRequest,
		"chatAlt": "Yes"
		},
		"subtitle": `Continue in dialog, do not reset context, and use "${chatModelB}."`
	},
	"cmd+ctrl+fn": {
		"valid": true,
		"arg": "",
		"variables": {
		"kikiType": fnType,
		"theRequest": theRequest,
		"chatAlt": "Yes"
		},
		"subtitle": fn16
	},
	"shift+fn": {
		"valid": true,
		"arg": "",
		"variables": {
		"kikiType": "dialogChat",
		"theRequest": theRequest,
		"chatContext": 1,
		"chatAlt": "List"
		},
		"subtitle": `Continue in dialog, reset context, and choose a model from the preset list.`
	},
	"shift+fn+alt": {
		"valid": true,
		"arg": "",
		"variables": {
		"kikiType": "replaceAll",
		"theRequest": theRequest,
		"chatContext": 1,
		"chatAlt": "List"
		},
		"subtitle": `Paste in frontmost app, reset context, and choose a model from the preset list.`
	},
	"shift+fn+ctrl": {
		"valid": true,
		"arg": "",
		"variables": {
		"kikiType": "dialogChat",
		"theRequest": theRequest,
		"chatAlt": "List"
		},
		"subtitle": `Continue in dialog, do not reset context, and choose a model from the preset list.`
	},
	"shift+fn+cmd": {
		"valid": true,
		"arg": "",
		"variables": {
		"kikiType": "dialogChat",
		"theRequest": theRequest,
		"chatContext": 1,
		"chatAlt": "List"
		},
		"subtitle": `Continue in dialog, reset context, and choose a model from the preset list.`
	},
	"shift+fn+ctrl+alt": {
		"valid": true,
		"arg": "",
		"variables": {
		"kikiType": "replaceAll",
		"theRequest": theRequest,
		"chatAlt": "List"
		},
		"subtitle": `Paste in frontmost app, do not reset context, and choose a model from the preset list.`
	},
	"shift+fn+cmd+ctrl": {
		"valid": true,
		"arg": "",
		"variables": {
		"kikiType": "dialogChat",
		"theRequest": theRequest,
		"chatAlt": "List"
		},
		"subtitle": `Continue in dialog, do not reset context, and choose a model from the preset list.`
	}
};

const scriptFilterItem = {
    "items": [
        {
            "uid": "quickChat",
            "type": "default",
            "title": theTitle,
            "subtitle": theSub,
            "arg": "",
            "variables": {
                "kikiType": kikiType,
                "theRequest": theRequest,
                "chatContext": 1
            },
            "mods": mods
        }
    ]
};

return JSON.stringify(scriptFilterItem);
}