import OpenAI from "openai";
import dotenv from "dotenv";
import promptSync from "prompt-sync";
import axios from "axios";
import {textToSpeech} from "./text_to_speach.js";
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPEN_WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// Setup OpenAI API
const openai = new OpenAI({apiKey: OPENAI_API_KEY});

async function getCurrentWeather(args) {
  try {
    const { location, unit } = args; // the arguments can potentially be wrong, so be sure to handle errors
    const units = unit === 'fahrenheit' ? 'imperial' : 'metric';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${units}&appid=${OPEN_WEATHER_API_KEY}`;
    console.log(url);
    const response = await axios.get(url);
    const data = response.data;
    return JSON.stringify({
      location: data.name,
      temperature: data.main.temp,
      unit: units === 'imperial' ? 'fahrenheit' : 'celsius'
    });
  } catch (error) {
    console.log(error);
    return JSON.stringify('Error fetching weather data. Service may be down.');
  }
}

// Note: the JSON response may not always be valid; be sure to handle errors
const availableFunctions = {
  // only one function in this example, but you can have multiple
  get_current_weather: getCurrentWeather,
};


const tools = [
  {
    type: "function",
    function: {
      name: "get_current_weather",
      description: "Get the current weather in a given location",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. San Francisco, CA",
          },
          unit: { type: "string", enum: ["celsius", "fahrenheit"] },
        },
        required: ["location"],
      },
    },
  },
];

async function runQuery(query, messages) {
  // Step 1: add the question to the conversation messages
  messages.push({ role: "user", content: query });

  // Step 2: Create a loop until the model doesn't want to call any more tools
  while (true) {
    // Step 3: call the model with the conversation messages and tools
    const response = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: messages,
      tools: tools,
      tool_choice: "auto", // auto is default, but we'll be explicit
    });

    const responseMessage = response.choices[0].message;

    // Step 4: check if the model wanted to call a tool
    const toolCalls = responseMessage.tool_calls;
    if (responseMessage.tool_calls) {
      messages.push(responseMessage); // extend conversation with assistant's reply

      // Step 5: call the tools and add their responses to the conversation
      for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name;
        const functionToCall = availableFunctions[functionName];
        const functionArgs = JSON.parse(toolCall.function.arguments);
        console.log(`  - Calling tool`, functionName, 'with args', functionArgs);
        const functionResponse = await functionToCall(functionArgs);
        console.log("    ↳ :", functionResponse);
        messages.push({
          tool_call_id: toolCall.id,
          role: "tool",
          name: functionName,
          content: functionResponse,
        }); // extend conversation with function response
      }
    }
    else {
      console.log('Finished reasoning.');
      messages.push({
        role: responseMessage.role,
        content: responseMessage.content,
      });
      return responseMessage.content;
    }
  }
}

// Main function. Runs in a loop to allow multiple questions for a longer conversation
async function main() {
  const prompt = promptSync();
  const messages = [
    // The "system" role is used to provide the AI with context about itself to give it a personality
    //{ role: "system", content: "You are a funny weather AI that helps user with weather questions. You are provided with tools you can use to answer questions. You should use tools to answer questions if they seem fit. Always respond to the user in a fun way." },
  ];
  while (true) {
    const query = prompt("Enter your query ('q' to quit): ");
    if (query.toLowerCase() === 'q') {
      console.log("Exiting...");
      rl.close();
      break;
    }
    const response = await runQuery(query, messages);
    console.log("Final response::", response);

    // Optional step: convert the response to speech and play it
    //await textToSpeech(openai, response);
  }
}


main().catch(console.error);
