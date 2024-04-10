#!/bin/bash

# Configuration variables
CONTEXT_MESSAGES_LIMIT=${chatContext}
MODEL="${chatModel}"
TEMPERATURE=${temperature}
MAX_TOKENS=${maxTokens}
PRESENCE_PENALTY=${prePenalty}
FREQUENCY_PENALTY=${frePenalty}
TOP_P=${topP}
SYSTEM_ROLE_MESSAGE="${chatSystem}"
NEW_MESSAGE="${theRequest}"
ALTERNATIVE_CHAT="${chatAlt}"
HISTORY_LIMIT=${historyLimit}
OPENAI_API_KEY="${APIToken_OAI}"
OPENROUTER_API_KEY="${APIToken_OR}"
ANTHROPIC_API_KEY="${APIToken_AN}"

# File Paths
HISTORY_PATH="${kiki_data}/history/"
EXTERNAL_CONTEXT="${externalContext}"
EXTERNAL_CONTEXT_PATH="${kiki_data}/lastExternalContext.txt"
REPLACE_CONTEXT="${repContext}"
MODEL_FILE="${kiki_data}/lastModel.txt"
RESPONSE_FILE="${kiki_data}/lastResponse.txt"
REQUEST_FILE="${kiki_data}/lastRequest.txt"
SYSTEM_FILE="${kiki_data}/lastSystem.txt"

# Define the context and other file paths
if [ "${createUserPresets}" == "Yes" ]; then
  if [ -z "$(find "${kiki_data}" -maxdepth 1 -type d -name 'preset*')" ]; then
    cp -r "$(pwd)/assets/presets_" "${kiki_data}"
  fi
fi

# Saving User's message by itself before sending... as a backup
echo "$NEW_MESSAGE" > "$REQUEST_FILE"

# Check if REPLACE_CONTEXT variable is non-empty
if [[ -n "$REPLACE_CONTEXT" ]]; then
	CONTEXT_FILE="$REPLACE_CONTEXT"
	echo "$REPLACE_CONTEXT" > "$EXTERNAL_CONTEXT_PATH"
else
	CONTEXT_FILE="${kiki_data}/context.json"
fi

# Check if EXTERNAL_CONTEXT variable is non-empty and if so, uses it as is
if [[ -n "$EXTERNAL_CONTEXT" ]] && [[ "$kikiType" != "pasteChat" ]]; then
    messages=$(cat "$EXTERNAL_CONTEXT")
	SYSTEM_ROLE_MESSAGE=$(echo "$messages" | jq -r '.[] | select(.role == "system") | .content')
elif [[ -n "$EXTERNAL_CONTEXT" ]] && [[ "$kikiType" == "pasteChat" ]]; then
	messages=$(cat "$EXTERNAL_CONTEXT" | jq --arg msg "$SYSTEM_ROLE_MESSAGE" '.[0].content = $msg')
else
    # Creates context file or cleans it if limit is set to 1
	if [[ ! -f "$CONTEXT_FILE" || $CONTEXT_MESSAGES_LIMIT -eq 1 ]]; then
	    messages=$(jq -n --arg msg "$SYSTEM_ROLE_MESSAGE" '[{"role":"system","content":$msg}]')
	# If it's for MD chat, it will always inject the System Role (could be preset)
	elif [[ "$kikiType" == "pasteChat" ]]; then
	    messages=$(cat "$CONTEXT_FILE" | jq --arg msg "$SYSTEM_ROLE_MESSAGE" '.[0].content = $msg')
	else
	    messages=$(cat "$CONTEXT_FILE")
		SYSTEM_ROLE_MESSAGE=$(echo "$messages" | jq -r '.[] | select(.role == "system") | .content')
	fi
fi

# Append the new message to the context array
messages=$(echo "$messages" | jq --arg msg "$NEW_MESSAGE" '. + [{"role":"user","content":$msg}]')

# If context limit is not zero, ensure we keep only the last N messages, plus the system role
if [[ "$CONTEXT_MESSAGES_LIMIT" -ne 0 ]]; then
    messages=$(echo "$messages" | jq --argjson limit "$CONTEXT_MESSAGES_LIMIT" '
        if ([.[] | select(.role != "system")] | length) > $limit
        then
            .[0] as $systemRole | (.[1:] | .[-$limit:]) | [$systemRole] + .
        else
            .
        end
    ')
fi

# Formulate the API request payload
payload=$(jq -n \
    --arg model "$MODEL" \
    --argjson messages "$messages" \
    --argjson temperature "$TEMPERATURE" \
	--argjson presence_penalty "$PRESENCE_PENALTY" \
	--argjson frequency_penalty "$FREQUENCY_PENALTY" \
	--argjson top_p "$TOP_P" \
    '{model: $model, messages: $messages, temperature: $temperature, presence_penalty: $presence_penalty, frequency_penalty: $frequency_penalty, top_p: $top_p}')

# If MAX_TOKENS is set, add it to the payload
if [[ "$MAX_TOKENS" -ne 0 ]]; then
    payload=$(echo "$payload" | jq --argjson max_tokens "$MAX_TOKENS" '. + {max_tokens: $max_tokens}')
fi

if [[ "$MODEL" == claude* ]]; then
    payload=$(jq -n \
        --arg model "$MODEL" \
        --arg system_message "$SYSTEM_ROLE_MESSAGE" \
		--argjson max_tokens "$(echo "$MAX_TOKENS" | jq 'tonumber | if . < 1 then 4000 else . end')" \
        --argjson user_messages "$(echo "$messages" | jq '[.[] | select(.role != "system")]')" \
        --argjson temperature "$TEMPERATURE" \
        --argjson top_p "$TOP_P" \
        '{model: $model, system: $system_message, max_tokens: $max_tokens, messages: $user_messages, temperature: $temperature, top_p: $top_p}')
fi

# Determine the API URL and headers based on the model string
API_URL="https://api.openai.com/v1/chat/completions"
HEADERS=(
    "-H" "Content-Type: application/json"
    "-H" "Authorization: Bearer $OPENAI_API_KEY"
)

if [[ "$MODEL" == *"/"* ]]; then
    API_URL="https://openrouter.ai/api/v1/chat/completions"
    # Update the authorization to use OPENROUTER_API_KEY instead of OPENAI_API_KEY
    HEADERS=(
        "-H" "Content-Type: application/json"
        "-H" "Authorization: Bearer $OPENROUTER_API_KEY"
        "-H" "HTTP-Referer: https://afadingthought.substack.com"
        "-H" "X-Title: Kiki"
    )

elif [[ "$MODEL" == claude* ]]; then
    API_URL="https://api.anthropic.com/v1/messages"
    # Update the authorization to use Anthropic's API key
    HEADERS=(
		"-H" "Content-Type: application/json"
		"-H" "x-api-key: $ANTHROPIC_API_KEY"
		"-H" "anthropic-version: 2023-06-01"
    )
fi

# Make the API request
response=$(curl -s -X POST "${HEADERS[@]}" -d "$payload" "$API_URL")

# Check for the existence of the "error" field in the response
if echo "$response" | jq -e '.error' > /dev/null; then
    # Extract the error message and use it as the assistant_response
    assistant_response=$(echo "$response" | jq -r '.error.message')
else
    # Extract the assistant's response trimming whitespaces with xargs
    if echo "$response" | jq -e '.choices' > /dev/null; then
        assistant_response=$(echo "$response" | jq -r '.choices[0].message.content | gsub("^\\s+|\\s+$";"")')
    elif echo "$response" | jq -e '.content' > /dev/null; then
        assistant_response=$(echo "$response" | jq -r '.content[0].text | gsub("^\\s+|\\s+$";"")')
    else
        echo "API request failed or did not return expected 'choices' field." >&2
        exit 1
    fi
fi

# Append the assistant's response to the messages
messages=$(echo "$messages" | jq --arg msg "$assistant_response" '. + [{"role":"assistant","content":$msg}]')

# Update the context file with the new messages
if [[ -n "$REPLACE_CONTEXT" ]]; then
	echo "$messages" > "$CONTEXT_FILE"
	echo "$messages" > "${kiki_data}/context.json"
else
	echo "$messages" > "$CONTEXT_FILE"
fi

# Write separate files
echo "$assistant_response" > "$RESPONSE_FILE"
echo "$MODEL" > "$MODEL_FILE"
echo "$SYSTEM_ROLE_MESSAGE" > "$SYSTEM_FILE"

#------------------------------------------------------ THE HISTORY LOGS
if [ "${historyLimit}" -ne 0 ]; then
  # Ensure the history path directory exists
  if [ ! -d "$HISTORY_PATH" ]; then
    mkdir -p "$HISTORY_PATH"
  fi

  # Format for the filename: YYMMDD-HHMMSS.json
  FILENAME=$(date +"%y%m%d-%H%M%S").json

  # Save the messages to a new file with the current date and time
  echo "$messages" > "$HISTORY_PATH/$FILENAME"

  # Check and maintain the history limit
  FILE_COUNT=$(find "$HISTORY_PATH" -maxdepth 1 -name '*.json' | wc -l)

  if [ "$FILE_COUNT" -gt "$HISTORY_LIMIT" ]; then
    # Calculate how many files to delete
    DELETE_COUNT=$((FILE_COUNT - HISTORY_LIMIT))
    
    # Delete the oldest files
    ls -t "$HISTORY_PATH"/*.json | tail -n "$DELETE_COUNT" | xargs -I {} rm {}
  fi
fi
#------------------------------------------------------


# Now lets call the action when returning
osascript -e 'tell application id "com.runningwithcrayons.Alfred" to run trigger "'${kikiType}'" in workflow "com.kiki.ai"'

# No need to echo the response here, as Alfred will read from RESPONSE_FILE