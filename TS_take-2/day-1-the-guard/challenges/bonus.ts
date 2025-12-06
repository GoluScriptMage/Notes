// 🔥 BONUS: Nightmare Mode - State Machine with Transitions
// Your task: Build a game character state machine with validation

// Step 1: Define all 5 character states
type IdleState = {
  status: "idle";
  health: number;
};
type WalkingState = {
  status: "walking";
  health: number;
  speed: number;
};
type RunningState = {
  status: "running";
  health: number;
  speed: number;
  stamina: number;
};
type JumpingState = {
  status: "jumping";
  health: number;
  height: number;
};
type AttackingState = {
  status: "attacking";
  health: number;
  damage: number;
  weaponType: string;
};

// Step 2: Create the union
type CharacterState =
  | IdleState
  | WalkingState
  | RunningState
  | JumpingState
  | AttackingState;

// Step 3: Write a function to describe the state
function describeState(currentState: CharacterState): string {
  switch (currentState.status) {
    case "idle": {
      return `Player is waiting, Health: ${currentState.health}.`;
    }
    case "walking": {
      return `Player is walking slowly at ${currentState.speed}units/s. Health: ${currentState.health}`;
    }
    case "running": {
      return `Player is sprinting at ${currentState.speed} units/s with ${currentState.stamina} Stamins.`;
    }
    case "jumping": {
      return `Player is airbone, currently at ${currentState.height} units high.`;
    }
    case "attacking": {
      return `Player is attacking with ${currentState.weaponType}, dealing ${currentState.damage} damage.`;
    }
    default: {
      const _exhaustiveCheck: never = currentState;
      return `Unhandled case: ${_exhaustiveCheck}`;
    }
  }
}

// Step 4: Define valid transitions
const validTransitions: Record<string, string[]> = {
  idle: ["walking", "attacking"],
  walking: ["idle", "running", "attacking"],
  running: ["walking", "jumping"],
  jumping: ["idle"],
  attacking: ["idle"],
};

// Step 5: Write the transition checker
function canTransition(
  currentState: CharacterState,
  nextState: string
): boolean {
  return validTransitions[currentState.status]?.includes(nextState) ?? false;
}

// Step 6: EXTRA HARD - Type-safe transition function
function transition(
  current: CharacterState,
  next: CharacterState
): CharacterState | null {
  const actionPossible = canTransition(current, next.status);
  if (!actionPossible) {
    return null;
  }

  return next;
}

// Test your code:
const idle: CharacterState = { status: "idle", health: 100 };
console.log(canTransition(idle, "walking")); // should be true
console.log(canTransition(idle, "running")); // should be false!

const walking: CharacterState = { status: "walking", health: 90, speed: 5 };
const running: CharacterState = {
  status: "running",
  health: 80,
  speed: 10,
  stamina: 50,
};
const jumping: CharacterState = { status: "jumping", health: 70, height: 15 };
const attacking: CharacterState = {
  status: "attacking",
  health: 60,
  damage: 25,
  weaponType: "sword",
};

console.log(transition(idle, attacking));
console.log(describeState(attacking));

// Expected behavior:
// - Idle can transition to Walking or Attacking
// - Walking can transition to Idle, Running, or Attacking
// - Running can transition to Walking or Jumping
// - Jumping can transition to Idle (landing)
// - Attacking can transition to Idle
