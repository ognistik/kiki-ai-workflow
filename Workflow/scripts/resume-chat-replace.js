// Import required ObjC libraries
ObjC.import('stdlib');

// Get environment variables and set paths
const jsonFilePath = $.getenv('repContext');
const currentDir = $.NSFileManager.defaultManager.currentDirectoryPath.js;
const iconPath = `${currentDir}/icon.png`;

// Function to read and parse JSON file
function readJSONFile(filePath) {
    const fileManager = $.NSFileManager.defaultManager;
    const contents = fileManager.contentsAtPath(filePath);
    const jsonString = $.NSString.alloc.initWithDataEncoding(contents, $.NSUTF8StringEncoding).js;
    return JSON.parse(jsonString);
}

// Read JSON file and extract last assistant message
const jsonData = readJSONFile(jsonFilePath);
const assistantMessages = jsonData.filter(msg => msg.role === 'assistant');
const lastAssistantContentFull = assistantMessages[assistantMessages.length - 1].content;

// Truncate content if it's too long
let lastAssistantContent = lastAssistantContentFull;
if (lastAssistantContent.length > 1700) {
    lastAssistantContent = lastAssistantContent.substring(0, 1700) + '...\n\n(Response truncated. Don\'t worry, your conversation is intact. You may reply back or copy.)';
}

// Function to escape special characters for AppleScript
function escapeForAppleScript(str) {
    return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

// Escape the content for AppleScript
const escapedContent = escapeForAppleScript(lastAssistantContent);
const escapedContentFull = escapeForAppleScript(lastAssistantContentFull);

// Construct the AppleScript
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

// Execute the AppleScript
const script = $.NSAppleScript.alloc.initWithSource(appleScript);
const executionResult = script.executeAndReturnError(null);
const resultString = ObjC.unwrap(executionResult.stringValue);

// Return the result
resultString;