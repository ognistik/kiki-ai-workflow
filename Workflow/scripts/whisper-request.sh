#!/bin/bash

MODEL="${chatModel}"
SAVETRANSCRIPTION="${kiki_data}/lastTranscription.txt"
WHISPERSERVICE="${whisperService}"

# Other Environment variables
APIToken_OAI=${APIToken_OAI}
APIToken_GROQ=${APIToken_GROQ}
whisperPrompt=${whisperPrompt}

# Splitting input into an array based on tabs
oIFS="$IFS"
IFS=$'\t' audioFilePaths=($1)
IFS="$oIFS"

# Sort the array and store it back in the same variable
IFS=$'\n' sorted=($(sort <<<"${audioFilePaths[*]}"))
unset IFS

# Assign the sorted array back to the original variable
audioFilePaths=("${sorted[@]}")

# Check file sizes
for filePath in "${audioFilePaths[@]}"; do
  fileSize=$(stat -f%z "$filePath")
  if [ $fileSize -gt 26214400 ]; then
    echo 'overLimit'
    exit 0
  fi
done

transcriptionList=""
firstEntry=true

# Process each file path for transcription if under the limit size.
for filePath in "${audioFilePaths[@]}"; do 
    if [ "$WHISPERSERVICE" = "openai" ]; then
        response=$(curl -X POST "https://api.openai.com/v1/audio/transcriptions" \
            -H "Authorization: Bearer $APIToken_OAI" \
            -H "Content-Type: multipart/form-data" \
            -F "model=whisper-1" \
            -F "prompt=$whisperPrompt" \
            -F "file=@$filePath")
    elif [ "$WHISPERSERVICE" = "groq" ]; then
        response=$(curl -X POST "https://api.groq.com/openai/v1/audio/transcriptions" \
            -H "Authorization: Bearer $APIToken_GROQ" \
            -H "Content-Type: multipart/form-data" \
            -F "model=whisper-large-v3" \
            -F "prompt=$whisperPrompt" \
            -F "file=@$filePath")
    fi

    # Extract the transcription text from the response and format it as a list if multiple files are provided.
    currentTranscription=$(echo $response | jq --raw-output '.text')
    
    if [ ${#audioFilePaths[@]} -gt 1 ]; then # If more than one file, format transcriptions as a list.
        if [ "$firstEntry" = true ]; then 
            firstEntry=false # Avoid adding newline at start for first entry.
        else 
            transcriptionList+=$'\n\n' # Add newline before next entry except for the first one.
        fi
        
        transcriptionList+="* $currentTranscription"
    else # For a single file, keep it simple.
        transcriptionList=$currentTranscription        
    fi   
done

echo "${transcriptionList}" > "$SAVETRANSCRIPTION"
echo "${transcriptionList}"