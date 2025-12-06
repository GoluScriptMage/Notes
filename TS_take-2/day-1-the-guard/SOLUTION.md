# 🛡️ Day 1: The Guard - SOLUTIONS

## Before You Look! ⚠️

Did you:

- [ ] Attempt ALL challenges?
- [ ] Struggle for at least 15-20 minutes on each?
- [ ] Get your code to compile (even if it's not perfect)?

If yes, continue! If no, go back and try harder! 💪

---

## 🟢 Solution 1: API Response Handler

```typescript
// Define the three response types
type LoadingResponse = {
  status: "loading";
};

type SuccessResponse = {
  status: "success";
  data: {
    temp: number;
    condition: string;
  };
};

type ErrorResponse = {
  status: "error";
  error: string;
};

// Create the discriminated union
type WeatherResponse = LoadingResponse | SuccessResponse | ErrorResponse;

// Handle the response with type narrowing
function handleWeatherResponse(response: WeatherResponse): string {
  switch (response.status) {
    case "loading":
      return "Fetching weather data...";

    case "success":
      return `It's ${response.data.temp}°C and ${response.data.condition}`;

    case "error":
      return `Failed to fetch weather: ${response.error}`;
  }
}

// Test cases
const loading: WeatherResponse = { status: "loading" };
console.log(handleWeatherResponse(loading));
// "Fetching weather data..."

const success: WeatherResponse = {
  status: "success",
  data: { temp: 22, condition: "sunny" },
};
console.log(handleWeatherResponse(success));
// "It's 22°C and sunny"

const error: WeatherResponse = {
  status: "error",
  error: "Network timeout",
};
console.log(handleWeatherResponse(error));
// "Failed to fetch weather: Network timeout"
```

### 🎯 Key Takeaways

1. **Each state is a separate type** - Makes them easy to understand and modify
2. **The discriminator (`status`) is a string literal** - Not just `string`
3. **TypeScript narrows inside each case** - You get auto-complete for `response.data`, etc.
4. **No `default` case needed** - TypeScript knows we've handled all cases

### 🎨 Alternative Style (Inline Types)

You could also define it like this:

```typescript
type WeatherResponse =
  | { status: "loading" }
  | { status: "success"; data: { temp: number; condition: string } }
  | { status: "error"; error: string };
```

Both styles work! Separate types are more verbose but easier to reuse.

---

## 🟡 Solution 2: Traffic Light Controller

```typescript
// Define each light type
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

// Create the discriminated union
type TrafficLight = RedLight | YellowLight | GreenLight;

// Handle each light color
function getTrafficInstruction(light: TrafficLight): string {
  switch (light.color) {
    case "red": {
      const camera = light.cameraActive ? " (Camera active)" : "";
      return `🛑 STOP! Wait ${light.timeRemaining}s${camera}`;
    }

    case "yellow":
      return `⚠️ SLOW DOWN: ${light.warning}`;

    case "green": {
      const pedestrian = light.pedestrianCrossing
        ? " (Watch for pedestrians)"
        : "";
      return `✅ GO!${pedestrian}`;
    }
  }
}

// Test cases
const red: TrafficLight = {
  color: "red",
  timeRemaining: 30,
  cameraActive: true,
};
console.log(getTrafficInstruction(red));
// "🛑 STOP! Wait 30s (Camera active)"

const yellow: TrafficLight = {
  color: "yellow",
  warning: "Prepare to stop",
};
console.log(getTrafficInstruction(yellow));
// "⚠️ SLOW DOWN: Prepare to stop"

const green: TrafficLight = {
  color: "green",
  pedestrianCrossing: true,
  duration: 45,
};
console.log(getTrafficInstruction(green));
// "✅ GO! (Watch for pedestrians)"
```

### 🎯 Key Takeaways

1. **Each light has DIFFERENT properties** - Red has camera, yellow has warning, green has pedestrian
2. **Conditional strings** - We used ternary operators to add optional details
3. **Block scopes in switch** - The `{}` around cases let us use `const` inside
4. **Rich data per state** - Not just status, but relevant context for each state

### 💡 Pro Tip: Why Use Blocks?

Notice the `{}` around some cases? This creates a block scope:

```typescript
case 'red': {
  const camera = '...'  // Only exists in this block
  return '...'
}
```

Without blocks, you'd get errors if multiple cases try to define the same variable name.

---

## 🔴 Solution 3: Package Delivery Tracker (Boss Fight)

```typescript
// Define each status type
type OrderedStatus = {
  status: "ordered";
  orderId: string;
  estimatedDays: number;
};

type ShippedStatus = {
  status: "shipped";
  trackingNumber: string;
  carrier: string;
  currentLocation: string;
};

type OutForDeliveryStatus = {
  status: "outForDelivery";
  driverName: string;
  estimatedTime: string;
};

type DeliveredStatus = {
  status: "delivered";
  deliveredAt: string;
  signedBy: string;
};

type FailedStatus = {
  status: "failed";
  reason: string;
  nextAttempt: string;
};

// Create the discriminated union with 5 variants
type PackageStatus =
  | OrderedStatus
  | ShippedStatus
  | OutForDeliveryStatus
  | DeliveredStatus
  | FailedStatus;

// Handle all package states
function getPackageUpdate(pkg: PackageStatus): string {
  switch (pkg.status) {
    case "ordered":
      return `📦 Order ${pkg.orderId} placed! Estimated delivery: ${pkg.estimatedDays} days`;

    case "shipped":
      return `🚚 Shipped via ${pkg.carrier} (${pkg.trackingNumber}). Currently in: ${pkg.currentLocation}`;

    case "outForDelivery":
      return `🚗 Out for delivery with ${pkg.driverName}. Estimated arrival: ${pkg.estimatedTime}`;

    case "delivered":
      return `✅ Delivered on ${pkg.deliveredAt}. Signed by: ${pkg.signedBy}`;

    case "failed":
      return `❌ Delivery failed: ${pkg.reason}. Next attempt: ${pkg.nextAttempt}`;

    default:
      // Exhaustiveness checking - this should never be reached
      const exhaustive: never = pkg;
      throw new Error(`Unhandled package status: ${exhaustive}`);
  }
}

// Test cases
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

### 🎯 Key Takeaways

1. **Handling 5+ states is no harder than 3** - The pattern scales beautifully
2. **Exhaustiveness checking with `never`** - If you add a new status, TypeScript will catch it
3. **Each state has its own unique data** - No `null` or `undefined` for missing fields
4. **Real-world complexity** - This models actual delivery tracking systems

### 🧠 Understanding the `never` Trick

```typescript
default:
  const exhaustive: never = pkg
  throw new Error(`Unhandled package status: ${exhaustive}`)
```

**What's happening here?**

- If ALL cases are handled, `pkg` has type `never` (impossible to reach)
- TypeScript is happy because `never` can be assigned to `never`
- If you ADD a new status later and forget to handle it, TypeScript will error here!

This is **exhaustiveness checking** - TypeScript forces you to handle all cases.

---

## 🔥 Solution 4: State Machine with Transitions (Nightmare Mode)

```typescript
// Define each character state
type IdleState = {
  state: "idle";
  health: number;
};

type WalkingState = {
  state: "walking";
  health: number;
  speed: number;
};

type RunningState = {
  state: "running";
  health: number;
  speed: number;
  stamina: number;
};

type JumpingState = {
  state: "jumping";
  health: number;
  height: number;
};

type AttackingState = {
  state: "attacking";
  health: number;
  damage: number;
  weaponType: string;
};

// Create the discriminated union
type CharacterState =
  | IdleState
  | WalkingState
  | RunningState
  | JumpingState
  | AttackingState;

// Describe the current state
function describeState(character: CharacterState): string {
  switch (character.state) {
    case "idle":
      return `⚡ Standing still (HP: ${character.health})`;

    case "walking":
      return `🚶 Walking at ${character.speed} m/s (HP: ${character.health})`;

    case "running":
      return `🏃 Running at ${character.speed} m/s (Stamina: ${character.stamina}, HP: ${character.health})`;

    case "jumping":
      return `🦘 Jumping ${character.height}m high (HP: ${character.health})`;

    case "attacking":
      return `⚔️ Attacking with ${character.weaponType} (Damage: ${character.damage}, HP: ${character.health})`;
  }
}

// Define valid transitions
const validTransitions: Record<string, string[]> = {
  idle: ["walking", "attacking"],
  walking: ["idle", "running", "attacking"],
  running: ["walking", "jumping"],
  jumping: ["idle"],
  attacking: ["idle"],
};

// Check if a transition is valid
function canTransition(current: CharacterState, nextState: string): boolean {
  const allowedTransitions = validTransitions[current.state];
  return allowedTransitions.includes(nextState);
}

// BONUS: Type-safe transition function
function transition(
  current: CharacterState,
  next: CharacterState
): CharacterState | null {
  if (canTransition(current, next.state)) {
    return next;
  }
  return null;
}

// Test cases
const idle: CharacterState = { state: "idle", health: 100 };
console.log(describeState(idle));
// "⚡ Standing still (HP: 100)"

console.log(canTransition(idle, "walking")); // true
console.log(canTransition(idle, "running")); // false ❌
console.log(canTransition(idle, "attacking")); // true

const running: CharacterState = {
  state: "running",
  health: 100,
  speed: 10,
  stamina: 50,
};
console.log(describeState(running));
// "🏃 Running at 10 m/s (Stamina: 50, HP: 100)"

console.log(canTransition(running, "jumping")); // true
console.log(canTransition(running, "attacking")); // false ❌

// Type-safe transition
const walking: CharacterState = {
  state: "walking",
  health: 100,
  speed: 5,
};
const newState = transition(idle, walking);
if (newState) {
  console.log(`Transitioned to: ${describeState(newState)}`);
} else {
  console.log("Invalid transition!");
}
```

### 🎯 Key Takeaways

1. **State machines are just fancy discriminated unions** - Each state is a variant
2. **Transition rules add business logic** - Not all states can go to all other states
3. **Type safety + runtime validation** - TypeScript checks types, functions check transitions
4. **Real game engines use this pattern** - Unity, Unreal, and custom engines all use state machines

### 🎮 How Game Engines Use This

```typescript
// Actual game code might look like:
class Character {
  private state: CharacterState;

  constructor() {
    this.state = { state: "idle", health: 100 };
  }

  attack(weaponType: string, damage: number) {
    if (canTransition(this.state, "attacking")) {
      this.state = {
        state: "attacking",
        health: this.state.health,
        damage,
        weaponType,
      };
    } else {
      console.log("Can't attack from current state!");
    }
  }

  update() {
    // Render based on current state
    console.log(describeState(this.state));
  }
}
```

This is how you keep complex game logic **bug-free**!

---

## 🏆 Congratulations!

You've completed Day 1! You now know:

✅ How to create discriminated unions  
✅ How to narrow types with switch statements  
✅ How to handle 3-5+ different states safely  
✅ How to build state machines  
✅ How to add exhaustiveness checking

### 📈 Next Steps

1. **Update your progress** in [../../ACHIEVEMENTS.md](../../ACHIEVEMENTS.md)
2. **Mark Day 1 complete** in [../../README.md](../../README.md)
3. **Take a break!** Let it sink in
4. **Move to Day 2** when ready: [../../day-2-the-factory/LESSON.md](../../day-2-the-factory/LESSON.md)

---

## 🎯 Common Mistakes (Learn from Others)

### Mistake 1: Using Regular Unions

```typescript
// ❌ BAD - No discriminator
type Response = {
  data?: User;
  error?: string;
};

// ✅ GOOD - Discriminated union
type Response =
  | { status: "success"; data: User }
  | { status: "error"; error: string };
```

### Mistake 2: Forgetting the Literal Type

```typescript
// ❌ BAD - 'status' is just string
type Response = {
  status: string;
  data?: User;
};

// ✅ GOOD - 'status' is a literal
type Response = {
  status: "success"; // Literal type!
  data: User;
};
```

### Mistake 3: Using `if/else` Instead of `switch`

```typescript
// ❌ Works, but harder to maintain
if (pkg.status === "ordered") {
  /* ... */
} else if (pkg.status === "shipped") {
  /* ... */
} else if (pkg.status === "delivered") {
  /* ... */
}

// ✅ Better - clearer structure
switch (pkg.status) {
  case "ordered": /* ... */
  case "shipped": /* ... */
  case "delivered": /* ... */
}
```

---

## 🎁 Bonus Resources

Want to dive deeper?

### Recommended Reading:

- TypeScript Handbook: [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [Discriminated Unions in Production](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)

### Real-World Examples:

- **Redux Toolkit**: All actions use discriminated unions
- **React Router**: Route definitions use discriminated unions
- **Apollo GraphQL**: Query results use discriminated unions

### Practice More:

Try modeling these with discriminated unions:

- Payment methods (credit card, PayPal, crypto)
- Form field types (text, number, date, select)
- HTTP responses (200, 404, 500, etc.)
- File types (image, video, document)

---

<div align="center">

### 🛡️ "You are now a Guardian. Protect your code from impossible states." 🛡️

**Ready for Day 2?** → [The Factory (Generics)](../../day-2-the-factory/LESSON.md)

Or take a break - you've earned it! ☕

</div>
