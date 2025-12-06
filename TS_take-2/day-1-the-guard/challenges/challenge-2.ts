// 🟡 Challenge 2: Traffic Light Controller
// Your task: Model a traffic light system with different properties per color

// Step 1: Define each light type
type RedLight = {
  color: "red";
  timeRemaining: number;
  cameraActive: boolean;
};
type YellowLight = {
  color: "yellow";
  warning: string;
};
type GreenLight = {
  color: "green";
  pedestrianCrossing: boolean;
  duration: number;
};

// Step 2: Create the union
type TrafficLight = RedLight | YellowLight | GreenLight;

// Step 3: Write the instruction function
function getTrafficInstruction(light: TrafficLight): string {
  // Your code here
  switch (light.color) {
    case "red": {
      return `STOP! Wait ${light.timeRemaining}s ${
        light.cameraActive ? "Camera Active" : " "
      }`;
    }
    case "yellow": {
      return `SLOW Down: ${light.warning}`;
    }
    case "green": {
      return `GO (${light.pedestrianCrossing ? "Watch for pedestrians" : " "})`;
    }
    default:
      {
        const _exhaustiveCheck: never = light;
        return `Can't find this ${_exhaustiveCheck}`;
      }
      break;
  }
}

// Step 4: Test your code
const red: TrafficLight = {
  color: "red",
  timeRemaining: 30,
  cameraActive: false,
};
console.log(getTrafficInstruction(red));

const yellow: TrafficLight = {
  color: "yellow",
  warning: "Prepare to stop",
};
console.log(getTrafficInstruction(yellow));

const green: TrafficLight = {
  color: "green",
  pedestrianCrossing: true,
  duration: 45,
};
console.log(getTrafficInstruction(green));

// Expected output:
// "🛑 STOP! Wait 30s (Camera active)"
// "⚠️ SLOW DOWN: Prepare to stop"
// "✅ GO! (Watch for pedestrians)"
