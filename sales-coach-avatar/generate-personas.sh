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

  echo "Creating persona: $NAME - $DESCRIPTION"

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
  CREATED_AT=$(echo $RESPONSE | jq -r '.createdAt')
  UPDATED_AT=$(echo $RESPONSE | jq -r '.updatedAt')
  BRAIN_ID=$(echo $RESPONSE | jq -r '.brain.id')

  # Check if the creation was successful
  if [ "$PERSONA_ID" != "null" ]; then
    echo "Created persona '$NAME' with ID: $PERSONA_ID"
    # Append the details to the output file
    echo "NEXT_PUBLIC_PERSONA_$NAME=$PERSONA_ID" >> $OUTPUT_FILE
  else
    echo "Failed to create persona '$NAME'"
    echo "Response: $RESPONSE"
  fi
}

# Store persona configurations as strings, matching the role-play scenarios
personaConfigurations=(
  "JORDAN|An existing subscriber interested in learning about a new product offering.|leo_desk|You are Jordan, a customer curious about a new product offering.|Curious and open to new ideas.|[\"Can you tell me more about this product?\", \"I'm interested, but I have some questions.\"]"
  "TAYLOR|A customer interested in purchasing a product but concerned about the pricing.|leo_windowdesk|You are Taylor, a customer who is hesitant about the pricing and is looking for a better deal.|Price-conscious and value-seeking.|[\"Is there any room for negotiation?\", \"Can you offer me a better price?\"]"
  "ALEX|A customer with concerns or objections about the product's suitability.|leo_windowsofacorner|You are Alex, a customer with objections about the product meeting your needs.|Skeptical and cautious.|[\"I'm not sure this is right for me.\", \"Can you convince me why I need this?\"]"
  "JAMIE|A customer ready to finalize the deal but may have final concerns.|leo_desk|You are Jamie, a customer ready to commit but may need reassurance.|Ready but hesitant.|[\"I think I'm ready, but what if something goes wrong?\", \"Is this the best choice for me?\"]"
  "SAM|A customer you've previously engaged with, now needing a follow-up.|leo_windowdesk|You are Sam, a customer who needs a follow-up after the last interaction.|Friendly and approachable.|[\"I'm glad you're following up!\", \"Can you remind me of what we discussed?\"]"
  "MORGAN|A customer needing help resolving a problem after the sale.|leo_windowsofacorner|You are Morgan, a customer who needs support with a post-sale issue.|Frustrated but open to solutions.|[\"I'm having a problem with my service.\", \"Can you help me fix this?\"]"
)

# Loop through the persona configurations and create personas
for personaConfig in "${personaConfigurations[@]}"; do
  echo "Processing: $personaConfig"

  IFS="|" read -r NAME DESCRIPTION PERSONA_PRESET SYSTEM_PROMPT PERSONALITY FILLER_PHRASES <<< "$personaConfig"
  create_persona "$NAME" "$DESCRIPTION" "$PERSONA_PRESET" "$SYSTEM_PROMPT" "$PERSONALITY" "$FILLER_PHRASES"
done

echo "Persona details have been saved to $OUTPUT_FILE."
