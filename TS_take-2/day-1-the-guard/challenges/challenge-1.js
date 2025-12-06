// 🟢 Challenge 1: API Response Handler (Warm-Up)
// Your task: Create a discriminated union for weather responses
console.log("--- STARTING CHALLENGE FILE ---");
// Step 3: Write the handler function
function handleWeatherResponse(response) {
    // Your code handleWeatherResponse
    switch (response.status) {
        case "loading": {
            return "Loading...";
        }
        case "success": {
            return "It's ".concat(response.data.temp, "'C and ").concat(response.data.condition);
        }
        case "error": {
            return "Failed to fetch weather: ".concat(response.error);
        }
        default:
            {
                var _exhaustiveCheck = response;
                return "Unhandled case: ".concat(_exhaustiveCheck);
            }
            break;
    }
}
// Step 4: Test your code
var loading = { status: "loading" };
console.log(handleWeatherResponse(loading));
console.log('Hello');
// Expected output:
// "Fetching weather data..."
// "It's 22°C and sunny"
// "Failed to fetch weather: Network timeout"
