ObjC.import('stdlib');
const jsonFilePath = $.getenv('theContext');
const currentDir = $.NSFileManager.defaultManager.currentDirectoryPath.js;
const iconPath = `${currentDir}/icon.png`;

function readJSONFile(filePath) {
    const fileManager = $.NSFileManager.defaultManager;
    const contents = fileManager.contentsAtPath(filePath);
    const jsonString = $.NSString.alloc.initWithDataEncoding(contents, $.NSUTF8StringEncoding).js;
    return JSON.parse(jsonString);
}

const jsonData = readJSONFile(jsonFilePath);
const assistantMessages = jsonData.filter(msg => msg.role === 'assistant');
const lastAssistantContent = assistantMessages[assistantMessages.length - 1].content;
const lastAssistantContentFull = lastAssistantContent;

let displayContent = lastAssistantContent;
if (displayContent.length > 1700) {
    displayContent = displayContent.substring(0, 1700) + '...\n\n(Response truncated. Don\'t worry, your conversation is intact. You may reply back or copy.)';
}

function escapeForAppleScript(str) {
    return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

const escapedContent = escapeForAppleScript(displayContent);
const escapedContentFull = escapeForAppleScript(lastAssistantContentFull);

Application('com.runningwithcrayons.Alfred').setConfiguration('theResponse', {
    toValue: 'Safari',
    inWorkflow: 'com.kiki.ai',
    exportable: true
});

const appleScript = `
    tell application "System Events"
        set userResponse to display dialog "${escapedContent}" buttons {"Close", "Copy & Close", "Continue"} with icon POSIX file "${iconPath}" default button 3 default answer "" cancel button "Close" with title "Continue Conversation"
        if button returned of userResponse is "Continue" then
            if text returned of userResponse is "" then
                set dialogInput to "-"
            else
                set dialogInput to text returned of userResponse
            end if
        else if button returned of userResponse is "Copy & Close" then
            set dialogInput to "-"
        else
            set dialogInput to ""
        end if
        return dialogInput
    end tell
`;

const script = $.NSAppleScript.alloc.initWithSource(appleScript);
const executionResult = script.executeAndReturnError(null);
const resultString = ObjC.unwrap(executionResult.stringValue);

resultString;