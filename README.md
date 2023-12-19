# ChatGPT with Tools Workshop🛠️

This project demonstrates the integration of ChatGPT with various tools (functions) using JavaScript in a Node.js environment. It includes a function to fetch current weather data and integrates it with the ChatGPT model.

## Prerequisites

Before running the project, ensure you have the following installed:
- Node.js (v18.x or later). Run `node -v` in the terminal.
- npm (usually comes with Node.js) Run `npm -v`in the terminal

## Setup

1. **Clone the Repository**
   - Clone this repository to your local machine using `git clone git@github.com:haakonjacobsen/chatgpt-tools-workshop.git`

2. **Install Dependencies**
   - Navigate to the project directory in your terminal.
   - Run `npm install` to install the required packages listed in `package.json`.

3. **Environment Variables**🔐
   - Create a `.env` file in the root of the project.
   - Add your OpenAI API key and OpenWeather API key in the `.env` file:

     (If you don't have one, you can create one for [OpenAI here](https://platform.openai.com/api-keys), and [OpenWeather here](https://openweathermap.org/appid). You need an OpenAI account and some dollars in your account to get started.).
     ```
     OPENAI_API_KEY=your_openai_api_key_here
     OPEN_WEATHER_API_KEY=your_openweather_api_key_here
     ```

## Running the Project

1. **Start the Application**🚀
   - In the project directory, run the command `node index.js` to start the application.

2. **Interact with ChatGPT**
   - Once the application is running, you can interact with ChatGPT through the command line.
   - Type your query and press Enter.
   - To exit, type 'q' and press Enter.

## Notes

- The current setup includes a function for fetching weather data. You can add more functions as needed.
- Ensure that you have a stable internet connection, as the project makes API calls to OpenAI and OpenWeather.
