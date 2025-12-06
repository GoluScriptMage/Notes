// 🟢 Challenge 1: API Response Handler (Warm-Up)
// Your task: Create a discriminated union for weather responses

// Step 1: Define your types here
type LoadingResponse = { status: "loading" };
type SuccessResponse = {
  status: "success";
  data: {
    temp: number;
    condition: string;
  };
};
type ErrorResponse = { status: "error"; error: string };

// Step 2: Create the union
type WeatherResponse = LoadingResponse | SuccessResponse | ErrorResponse;

// Step 3: Write the handler function
function handleWeatherResponse(response: WeatherResponse): string {
  // Your code handleWeatherResponse
  switch (response.status) {
    case "loading": {
      return "Fetching weather data...";
    }
    case "success": {
      return `It's ${response.data.temp}'C and ${response.data.condition}`;
    }
    case "error": {
      return `Failed to fetch weather: ${response.error}`;
    }

    default:
      {
        const _exhaustiveCheck: never = response;
        return `Unhandled case: ${_exhaustiveCheck}`;
      }
      break;
  }
}

// Step 4: Test your code
const loading: WeatherResponse = { status: "loading" };
console.log(handleWeatherResponse(loading));

const success: WeatherResponse = {
  status: "success",
  data: {
    temp: 22,
    condition: "sunny",
  },
};
console.log(handleWeatherResponse(success));

const error: WeatherResponse = {
  status: "error",
  error: "Network Error",
};
console.log(handleWeatherResponse(error));

// Expected output:
// "Fetching weather data..."
// "It's 22°C and sunny"
// "Failed to fetch weather: Network timeout"
