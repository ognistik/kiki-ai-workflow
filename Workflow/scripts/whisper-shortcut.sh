#!/bin/bash

# audioFilePath=("${audioFilePath[@]}")
audioFilePath="${audioFilePath}"
kikiSplit5="${kikiSplit5}"

# Check for the special case of kikiSplit5 environment variable
if [ -n "$kikiSplit5" ]; then
  audioFilePath=$kikiSplit5
fi


# Trigger "Kiki Whisper" shortcut and get file path
if [ -z "$audioFilePath" ]; then
audioFilePath=$(osascript -e 'with timeout of 3600 seconds
tell application "Shortcuts Events" to run shortcut "Kiki Whisper"
end timeout')
fi

# echo "${audioFilePath[@]}"
echo "${audioFilePath}"