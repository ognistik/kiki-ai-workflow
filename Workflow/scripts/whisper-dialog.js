ObjC.import('stdlib');
var transcriptionOri = $.getenv('transcription');
let transcription = transcriptionOri;
const currentDir = $.NSFileManager.defaultManager.currentDirectoryPath.js
const iconPath = `${currentDir}/icon.png`;

if (transcription.length > 1700) {
  transcription = transcription.substring(0, 1700) + "...\n\n(Response truncated. Don't worry, your conversation is intact. The options below will process the full response.)";
}

// Escape file contents for AppleScript
let escapedTranscription = transcription.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

const appleScript = `
    set userResponse to display dialog "${escapedTranscription}" buttons {"Close", "Run Preset", "Copy"} with icon POSIX file "${iconPath}" default button 3 cancel button "Close" with title "Whisper AI Transcription"
	if button returned of userResponse is not "Close" then
            return button returned of userResponse
        end if
`;

const script = $.NSAppleScript.alloc.initWithSource(appleScript);
const executionResult = script.executeAndReturnError(null);
const resultString = ObjC.unwrap(executionResult.stringValue);

resultString;