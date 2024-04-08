ObjC.import('stdlib');

function run(argv) {
    var kiki_data = $.getenv('kiki_data');
    const alfredWorkflowData = kiki_data;
    var modelsPath = `${alfredWorkflowData}/presets/models.json`;
    var ALTERNATIVE_CHAT = $.getenv('chatAlt');
    var chatModelB = $.getenv('chatModelB');
    var MODEL = "";
    var SYSTEM_ROLE_MESSAGE = $.getenv('chatSystem');

    try {
        SYSTEM_ROLE_MESSAGE_B = $.getenv('chatSystemB');
    } catch (error) {
        SYSTEM_ROLE_MESSAGE_B = '';
    }

    if (ALTERNATIVE_CHAT === "Yes") {
        MODEL = chatModelB;
        if (SYSTEM_ROLE_MESSAGE_B !== '') {
            SYSTEM_ROLE_MESSAGE = SYSTEM_ROLE_MESSAGE_B;
        }
    } else if (ALTERNATIVE_CHAT === "List") {
        var modelsJson = $.NSString.stringWithContentsOfFileEncodingError(modelsPath, $.NSUTF8StringEncoding, null);
        var models = JSON.parse(ObjC.unwrap(modelsJson));
        var ids = models.map(function(model) { return model.id.replace(/^M_/, ''); }).sort();

        var appleScript = `
            set modelIDs to {${ids.map(id => '"' + id + '"').join(", ")}}
            set chosenID to choose from list modelIDs with title "Custom User Models" with prompt "Choose a Model from your presets file:" default items {modelIDs's item 1} without multiple selections allowed and empty selection allowed
            if chosenID is not false then
                chosenID as text
            else
                "CANCELLED"
            end if
        `;

        var script = $.NSAppleScript.alloc.initWithSource(appleScript);
        var executionResult = script.executeAndReturnError(null);
        var chosenIdWithoutPrefix = ObjC.unwrap(executionResult.stringValue);

        if (chosenIdWithoutPrefix !== "CANCELLED") {
            // Match the chosen ID without prefix to the original ID with prefix
            var chosenModel = models.find(function(model) { return model.id.endsWith(chosenIdWithoutPrefix); });
            if (chosenModel) {
                MODEL = chosenModel.theModel;
            }
        }
    }

    const output = {
        alfredworkflow: {
            arg: "",
            variables: {
                chatModel: MODEL,
                chatSystem: SYSTEM_ROLE_MESSAGE,
            }
        }
    };

    return JSON.stringify(output);
}