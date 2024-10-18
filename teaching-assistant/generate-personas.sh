#!/bin/bash

# Define the API key and the output file
API_KEY="your_api_key"
OUTPUT_FILE="persona-ids.txt"

# Define the API URL
API_URL="https://api.anam.ai/v1/personas"

# Clear the output file
> $OUTPUT_FILE

# Create a persona and capture its ID and other relevant fields
create_persona() {
  NAME=$1
  DESCRIPTION=$2
  PERSONA_PRESET=$3
  SYSTEM_PROMPT=$4
  PERSONALITY=$5
  FILLER_PHRASES=$6

  # Make the API request to create the persona
  RESPONSE=$(curl -s -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $API_KEY" \
    -d "{
          \"name\": \"$NAME\",
          \"description\": \"$DESCRIPTION\",
          \"personaPreset\": \"$PERSONA_PRESET\",
          \"brain\": {
            \"systemPrompt\": \"$SYSTEM_PROMPT\",
            \"personality\": \"$PERSONALITY\",
            \"fillerPhrases\": $FILLER_PHRASES
          }
        }")

  # Extract persona details from the response
  PERSONA_ID=$(echo $RESPONSE | jq -r '.id')

  # Check if the creation was successful
  if [ "$PERSONA_ID" != "null" ]; then
    echo "$PERSONA_ID"
  else
    echo "Failed to create persona '$NAME'"
    echo "Response: $RESPONSE"
    exit 1
  fi
}

# Store persona configurations as strings
personaConfigurations=(
  "Leo|Leo is a friendly AI language teacher for French learners.|leo_desk|You are Leo, a virtual assistant for learning French.|You are friendly and approachable.|[\"Let me check that for you.\", \"Please hold on a moment.\"]"
  "Leo|Leo is a professional AI language teacher for French learners.|leo_desk|You are Leo, a virtual assistant for learning French.|You are professional and direct.|[\"Let me explain that for you.\", \"One moment please.\"]"
  "Leo|Leo is a formal AI language tutor for French learners.|leo_desk|You are Leo, an AI tutor for learning French.|You are formal and focused on teaching.|[\"Let me check that for you.\", \"Please hold on a moment.\"]"
  "Leo|Leo is a friendly AI language teacher for Spanish learners.|leo_desk|You are Leo, a virtual assistant for learning Spanish.|You are friendly and approachable.|[\"Let me check that for you.\", \"Please hold on a moment.\"]"
  "Leo|Leo is a professional AI language teacher for Spanish learners.|leo_desk|You are Leo, a virtual assistant for learning Spanish.|You are professional and direct.|[\"Let me explain that for you.\", \"One moment please.\"]"
  "Leo|Leo is a formal AI language tutor for Spanish learners.|leo_desk|You are Leo, an AI tutor for learning Spanish.|You are formal and focused on teaching.|[\"Let me check that for you.\", \"Please hold on a moment.\"]"
  "Leo|Leo is a friendly AI language teacher for German learners.|leo_desk|You are Leo, a virtual assistant for learning German.|You are friendly and approachable.|[\"Let me check that for you.\", \"Please hold on a moment.\"]"
  "Leo|Leo is a professional AI language teacher for German learners.|leo_desk|You are Leo, a virtual assistant for learning German.|You are professional and direct.|[\"Let me explain that for you.\", \"One moment please.\"]"
  "Leo|Leo is a formal AI language tutor for German learners.|leo_desk|You are Leo, an AI tutor for learning German.|You are formal and focused on teaching.|[\"Let me check that for you.\", \"Please hold on a moment.\"]"
)

# Loop through the persona configurations and collect the persona IDs
persona_ids=()
for personaConfig in "${personaConfigurations[@]}"; do
  echo "Processing: $personaConfig"

  IFS="|" read -r NAME DESCRIPTION PERSONA_PRESET SYSTEM_PROMPT PERSONALITY FILLER_PHRASES <<< "$personaConfig"
  PERSONA_ID=$(create_persona "$NAME" "$DESCRIPTION" "$PERSONA_PRESET" "$SYSTEM_PROMPT" "$PERSONALITY" "$FILLER_PHRASES")
  persona_ids+=("$PERSONA_ID")
done

# Output the persona IDs
{
  echo "NEXT_PUBLIC_PERSONA_FRENCH_FRIENDLY=${persona_ids[0]}"
  echo "NEXT_PUBLIC_PERSONA_FRENCH_PROFESSIONAL=${persona_ids[1]}"
  echo "NEXT_PUBLIC_PERSONA_FRENCH_FORMAL=${persona_ids[2]}"
  echo ""
  echo "NEXT_PUBLIC_PERSONA_SPANISH_FRIENDLY=${persona_ids[3]}"
  echo "NEXT_PUBLIC_PERSONA_SPANISH_PROFESSIONAL=${persona_ids[4]}"
  echo "NEXT_PUBLIC_PERSONA_SPANISH_FORMAL=${persona_ids[5]}"
  echo ""
  echo "NEXT_PUBLIC_PERSONA_GERMAN_FRIENDLY=${persona_ids[6]}"
  echo "NEXT_PUBLIC_PERSONA_GERMAN_PROFESSIONAL=${persona_ids[7]}"
  echo "NEXT_PUBLIC_PERSONA_GERMAN_FORMAL=${persona_ids[8]}"
} >> $OUTPUT_FILE

echo "Persona details have been saved to $OUTPUT_FILE."
