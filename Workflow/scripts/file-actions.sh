#!/bin/bash

# Construct the full POSIX path to context.json
kikiContextPath="${kiki_data}/context.json"
newContextPath="${copyContextPath}"

if [[ "$1" == "filesCopyResponse" || "$1" == "-" ]]; then
    echo -n "$(cat "${kiki_data}/lastresponse.txt")"

elif [[ "$1" == "filesCopyTranscription" ]]; then
    echo -n "$(cat "${kiki_data}/lastTranscription.txt")"

elif [[ "$1" == "filesCopyContext" ]]; then
	# Extract filename
	filename=$(basename -- "$kikiContextPath")
	extension="${filename##*.}"
	basename="${filename%.*}"

	# Create a unique filename if file already exists
	counter=1
	newFilePath="$newContextPath/$filename"
	while [ -f "$newFilePath" ]; do
  	newFilePath="$newContextPath/${basename}_$counter.$extension"
	let counter++
	done

	# Copy the file to the new unique path
	cp "$kikiContextPath" "$newFilePath"

elif [[ "$1" == "filesResetLogs" ]]; then
	# Prompt for confirmation before deletion
    osascript -e 'display dialog "Are you sure you want to reset your chat context and log files?" buttons {"Cancel", "Delete"} default button "Delete" cancel button "Cancel"' >/dev/null 2>&1

	# Check the user's choice
	if [ $? -eq 0 ]; then
    		# User chose to delete
		find "${kiki_data}" -type f ! -regex "${kiki_data}/preset.*" -delete
    		osascript -e 'display dialog "Everything has been cleared." buttons {"OK"} default button "OK"' >/dev/null 2>&1
	fi

elif [[ "$1" == "filesOpenContext" ]]; then
	open "$kikiContextPath"

elif [[ "$1" == "filesRevealPath" ]]; then
	open "${kiki_data}/"

elif [[ "$1" == "filesRevealWorkflow" ]]; then
	osascript -e 'tell application "Alfred" to reveal workflow "com.kiki.ai"'

elif [[ "$1" == "filesOpenWFDir" ]]; then
	open "$(pwd)"

fi