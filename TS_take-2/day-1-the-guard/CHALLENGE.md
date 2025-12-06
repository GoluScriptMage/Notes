# 🛡️ Day 1: The Guard - CHALLENGE

## Your Mission 🎯

Welcome, Guardian in training! You've learned the theory - now it's time to prove you can handle multiple states like a pro.

**Remember the NO PEEK rule**: Try these challenges WITHOUT looking at the solution. Struggle = growth! 💪

---

## 🟢 Challenge 1: API Response Handler (Warm-Up)

### The Scenario

You're building a weather app that fetches data from an API. The response can be in three states:

1. **Loading**: Fetching data
2. **Success**: Got the weather data
3. **Error**: Something went wrong

### Your Task

Create a function called `handleWeatherResponse` that:

1. Defines a discriminated union type `WeatherResponse` with three variants:

   - `LoadingResponse`: `{ status: 'loading' }`
   - `SuccessResponse`: `{ status: 'success', data: { temp: number, condition: string } }`
   - `ErrorResponse`: `{ status: 'error', error: string }`

2. Takes a `WeatherResponse` as a parameter

3. Uses a **switch statement** to return different strings:
   - `'loading'` → `"Fetching weather data..."`
   - `'success'` → `"It's [temp]°C and [condition]"`
   - `'error'` → `"Failed to fetch weather: [error]"`

### Expected Behavior

```typescript
const loading: WeatherResponse = { status: "loading" };
console.log(handleWeatherResponse(loading));
// Output: "Fetching weather data..."

const success: WeatherResponse = {
  status: "success",
  data: { temp: 22, condition: "sunny" },
};
console.log(handleWeatherResponse(success));
// Output: "It's 22°C and sunny"

const error: WeatherResponse = {
  status: "error",
  error: "Network timeout",
};
console.log(handleWeatherResponse(error));
// Output: "Failed to fetch weather: Network timeout"
```

### Write Your Code Here

👉 File: `challenges/challenge-1.ts`

<details>
<summary>💡 Hint 1 (Click if stuck)</summary>

Start by defining the three separate types first:

```typescript
type LoadingResponse = { status: "loading" };
type SuccessResponse = {
  /* ... */
};
type ErrorResponse = {
  /* ... */
};
```

Then combine them with `|`

</details>

<details>
<summary>💡 Hint 2 (Click if still stuck)</summary>

Your switch statement should look like:

```typescript
switch (response.status) {
  case "loading":
    return "...";
  case "success":
    return `It's ${response.data.temp}°C...`;
  // etc
}
```

</details>

---

## 🟡 Challenge 2: Traffic Light Controller

### The Scenario

You're building a smart traffic light system. Each light color has different properties:

- **Red**: Has `timeRemaining` (seconds) and a `cameraActive` flag for red-light violations
- **Yellow**: Has a `warning` message
- **Green**: Has `pedestrianCrossing` (boolean) and `duration` (seconds)

### Your Task

1. Create a discriminated union `TrafficLight` with three variants:

   - `RedLight`: `{ color: 'red', timeRemaining: number, cameraActive: boolean }`
   - `YellowLight`: `{ color: 'yellow', warning: string }`
   - `GreenLight`: `{ color: 'green', pedestrianCrossing: boolean, duration: number }`

2. Write a function `getTrafficInstruction` that:
   - Takes a `TrafficLight` parameter
   - Returns instructions for drivers based on the light color
   - For red: Include time remaining and camera warning if active
   - For yellow: Include the warning message
   - For green: Mention pedestrian crossing if active

### Expected Behavior

```typescript
const red: TrafficLight = {
  color: "red",
  timeRemaining: 30,
  cameraActive: true,
};
console.log(getTrafficInstruction(red));
// Output: "🛑 STOP! Wait 30s (Camera active)"

const yellow: TrafficLight = {
  color: "yellow",
  warning: "Prepare to stop",
};
console.log(getTrafficInstruction(yellow));
// Output: "⚠️ SLOW DOWN: Prepare to stop"

const green: TrafficLight = {
  color: "green",
  pedestrianCrossing: true,
  duration: 45,
};
console.log(getTrafficInstruction(green));
// Output: "✅ GO! (Watch for pedestrians)"
```

### Write Your Code Here

👉 File: `challenges/challenge-2.ts`

<details>
<summary>💡 Hint (Click if stuck)</summary>

For the red light, use a conditional:

```typescript
case 'red':
  const camera = light.cameraActive ? ' (Camera active)' : ''
  return `🛑 STOP! Wait ${light.timeRemaining}s${camera}`
```

</details>

---

## 🔴 Challenge 3: Package Delivery Tracker (Boss Fight)

### The Scenario

You're building a package tracking system for a delivery company. A package goes through multiple states, each with different information:

1. **Ordered**: Just placed, has `orderId` and `estimatedDays`
2. **Shipped**: On the way, has `trackingNumber`, `carrier`, and `currentLocation`
3. **OutForDelivery**: Almost there, has `driverName` and `estimatedTime` (e.g., "2:00 PM")
4. **Delivered**: Complete, has `deliveredAt` (Date string) and `signedBy` (name or "Left at door")
5. **Failed**: Problem occurred, has `reason` and `nextAttempt` (Date string)

### Your Task

1. Create a discriminated union `PackageStatus` with FIVE variants (use `status` as discriminator)

2. Write a function `getPackageUpdate` that:

   - Takes a `PackageStatus` parameter
   - Returns a user-friendly status message
   - Include all relevant details for each state

3. BONUS: Add exhaustiveness checking with a `default` case that throws an error

### Expected Behavior

```typescript
const ordered: PackageStatus = {
  status: "ordered",
  orderId: "ORD-123",
  estimatedDays: 3,
};
console.log(getPackageUpdate(ordered));
// "📦 Order ORD-123 placed! Estimated delivery: 3 days"

const shipped: PackageStatus = {
  status: "shipped",
  trackingNumber: "TRK-456",
  carrier: "FedEx",
  currentLocation: "Los Angeles, CA",
};
console.log(getPackageUpdate(shipped));
// "🚚 Shipped via FedEx (TRK-456). Currently in: Los Angeles, CA"

const outForDelivery: PackageStatus = {
  status: "outForDelivery",
  driverName: "John",
  estimatedTime: "2:00 PM",
};
console.log(getPackageUpdate(outForDelivery));
// "🚗 Out for delivery with John. Estimated arrival: 2:00 PM"

const delivered: PackageStatus = {
  status: "delivered",
  deliveredAt: "2024-12-05 14:30",
  signedBy: "Jane Doe",
};
console.log(getPackageUpdate(delivered));
// "✅ Delivered on 2024-12-05 14:30. Signed by: Jane Doe"

const failed: PackageStatus = {
  status: "failed",
  reason: "Address not found",
  nextAttempt: "2024-12-06",
};
console.log(getPackageUpdate(failed));
// "❌ Delivery failed: Address not found. Next attempt: 2024-12-06"

```

### Write Your Code Here

👉 File: `challenges/challenge-3.ts`

<details>
<summary>💡 Hint (Click if stuck)</summary>

Define each status type separately first:

```typescript
type OrderedStatus = {
  status: 'ordered'
  orderId: string
  estimatedDays: number
}
// ... define the other 4
type PackageStatus = OrderedStatus | ShippedStatus | /* etc */
```

</details>

---

## 🔥 BONUS: Nightmare Mode Challenge

### Challenge 4: State Machine with Transitions

**This is OPTIONAL but will seriously level up your skills!**

### The Scenario

Build a game character state machine where certain transitions are only valid from specific states:

- **Idle**: Can transition to Walking or Attacking
- **Walking**: Can transition to Idle, Running, or Attacking
- **Running**: Can transition to Walking or Jumping
- **Jumping**: Can transition to Idle (landing)
- **Attacking**: Can transition to Idle

Each state has different properties:

- **Idle**: `health: number`
- **Walking**: `health: number, speed: number`
- **Running**: `health: number, speed: number, stamina: number`
- **Jumping**: `health: number, height: number`
- **Attacking**: `health: number, damage: number, weaponType: string`

### Your Task

1. Create the discriminated union `CharacterState`

2. Write a function `describeState` that describes the current state

3. **HARD PART**: Write a function `canTransition` that takes:
   - Current state
   - Desired next state name (string)
   - Returns `true` if the transition is valid, `false` otherwise

### Expected Behavior

### 📝 State Machine Output Requirements

This table shows the properties you must safely access and include in the final string output for the `describeState` function.

| State Status | Properties Available (Type Narrowing) | Desired Output Format |
| :--- | :--- | :--- |
| **"idle"** | `health` | "Player is waiting, Health: [health]." |
| **"walking"** | `health`, `speed` | "Player is walking slowly at [speed] units/s. Health: [health]." |
| **"running"** | `speed`, `stamina` | "Player is sprinting at [speed] units/s with [stamina] Stamina." |
| **"jumping"** | `height` | "Player is airborne, currently at [height] units high." |
| **"attacking"** | `damage`, `weaponType` | "Player is attacking with a [weaponType], dealing [damage] damage." |

---
**Sia's Note:** Use the `switch` statement! When you hit `case "running":`, TypeScript *guarantees* that `currentState.speed` and `currentState.stamina` are available for safe access!

```typescript
const idle: CharacterState = { state: "idle", health: 100 };
console.log(canTransition(idle, "walking")); // true
console.log(canTransition(idle, "running")); // false (must walk first!)

const running: CharacterState = {
  state: "running",
  health: 100,
  speed: 10,
  stamina: 50,
};
console.log(canTransition(running, "jumping")); // true
console.log(canTransition(running, "attacking")); // false
```

### Write Your Code Here

👉 File: `challenges/bonus.ts`

<details>
<summary>💡 Hint (Click if stuck)</summary>

Create a mapping of valid transitions:

```typescript
const validTransitions: Record<string, string[]> = {
  idle: ["walking", "attacking"],
  walking: ["idle", "running", "attacking"],
  // etc
};

function canTransition(current: CharacterState, next: string): boolean {
  return validTransitions[current.state].includes(next);
}
```

</details>

---

## ✅ Completion Checklist

Before checking the solutions, make sure:

- [ ] All code compiles without TypeScript errors
- [ ] You used discriminated unions (not simple unions)
- [ ] You used switch statements (not if/else chains)
- [ ] TypeScript auto-completes properties inside each case
- [ ] You can't access properties from the wrong variant
- [ ] You tested with the example inputs
- [ ] You struggled for at least 15 minutes on each challenge

---

## 🎯 What You're Learning

By completing these challenges, you're mastering:

✅ **Discriminated Union syntax**  
✅ **Type narrowing with switch statements**  
✅ **Exhaustiveness checking**  
✅ **Handling complex state with type safety**  
✅ **Real-world patterns used in production code**

---

## 🚀 Done? Check Your Work!

Once you've attempted ALL challenges (or struggled for 30+ minutes), check:

👉 [SOLUTION.md](./SOLUTION.md) to see the answers

**Remember**: It's okay if your solution is different! As long as:

- It compiles without errors
- It uses discriminated unions
- It handles all cases safely

---

## 📊 Track Your Progress

Update your achievements:

- [ ] Completed Challenge 1 (Warm-Up)
- [ ] Completed Challenge 2 (Intermediate)
- [ ] Completed Challenge 3 (Boss Fight)
- [ ] Attempted Bonus Challenge (Nightmare Mode)

Add to [../../ACHIEVEMENTS.md](../../ACHIEVEMENTS.md)!

---

<div align="center">

### 🛡️ "A Guardian doesn't fear multiple states. They embrace them." 🛡️

**Good luck, Guardian!** May your types be narrow and your states be safe! 🎯

</div>
