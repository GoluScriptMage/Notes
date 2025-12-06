# 🚀 Getting Started with TypeScript Speed Run

## Prerequisites

### What You Should Know:

- ✅ Basic JavaScript (variables, functions, objects, arrays)
- ✅ How to use a terminal/command line
- ✅ Basic understanding of types (what's a string vs number)
- ✅ VS Code or any code editor

### What You DON'T Need:

- ❌ Advanced TypeScript knowledge (that's what we're learning!)
- ❌ Framework experience (we use generic examples)
- ❌ Computer Science degree (we explain everything)

---

## ⚙️ Installation

### Step 1: Install Node.js

If you don't have Node.js installed:

```bash
# Check if you have Node.js
node --version

# If not, download from: https://nodejs.org/
# Get the LTS (Long Term Support) version
```

### Step 2: Install TypeScript Globally (Optional)

```bash
npm install -g typescript

# Verify installation
tsc --version
```

### Step 3: Set Up the Project

```bash
# Navigate to the project folder
cd TS_take-2

# Install dependencies
npm install

# Test TypeScript compilation
npm run check
```

---

## 🛠️ Project Setup

### VS Code Extensions (Recommended)

Install these for the best experience:

1. **TypeScript Language Basics** (built-in, should be enabled)
2. **Error Lens** - See errors inline (optional but AMAZING)
3. **Pretty TypeScript Errors** - Makes errors readable
4. **Code Spell Checker** - Catch typos

---

## 📁 Folder Structure Explained

```
TS_take-2/
│
├── day-1-the-guard/
│   ├── LESSON.md           ← Read this first
│   ├── CHALLENGE.md        ← Your coding task
│   ├── SOLUTION.md         ← Check after completing
│   ├── challenges/
│   │   ├── challenge-1.ts  ← Write your code here
│   │   ├── challenge-2.ts
│   │   └── bonus.ts
│   └── examples/
│       └── reference.ts    ← Working examples
```

### How to Use Each Folder:

**LESSON.md**: Read this to understand the concept. Includes analogies and explanations.

**CHALLENGE.md**: Your mission. Don't peek at the solution until you try!

**SOLUTION.md**: The answer key. Only look after attempting!

**challenges/**: Your coding playground. Write your solutions here.

**examples/**: Reference code that works. Use for inspiration.

---

## 🎮 How to Work Through Each Day

### The Workflow:

1. **Read** `LESSON.md` (10-15 minutes)

   - Understand the concept
   - Review the analogies
   - Check the examples

2. **Attempt** `CHALLENGE.md` (30-60 minutes)

   - Open the challenge file in `challenges/`
   - Write your code
   - Test it by running TypeScript compiler

3. **Verify** `SOLUTION.md` (10-15 minutes)

   - Compare your solution
   - Understand differences
   - Learn alternative approaches

4. **Level Up** with Bonus Challenges (30-45 minutes)
   - Try harder variations
   - Combine concepts
   - Build mini-projects

---

## 🔧 Running TypeScript Code

### Method 1: Check for Errors (Fastest)

```bash
# Check a specific file
npx tsc day-1-the-guard/challenges/challenge-1.ts --noEmit

# Check all files
npm run check
```

### Method 2: Compile and Run

```bash
# Compile TypeScript to JavaScript
npx tsc day-1-the-guard/challenges/challenge-1.ts

# Run the JavaScript
node day-1-the-guard/challenges/challenge-1.js
```

### Method 3: Use ts-node (Recommended)

```bash
# Install ts-node if not already
npm install -g ts-node

# Run TypeScript directly
ts-node day-1-the-guard/challenges/challenge-1.ts
```

---

## 💡 Pro Tips

### Tip 1: Use the TypeScript Playground

For quick experiments, use: https://www.typescriptlang.org/play

### Tip 2: Read Error Messages Carefully

TypeScript errors are VERBOSE but helpful. Read them bottom-to-top.

### Tip 3: Hover Over Everything

In VS Code, hover over variables to see their inferred types. This is GOLD for learning!

### Tip 4: Use `console.log()` Liberally

Add logs to see what TypeScript thinks the type is at runtime.

### Tip 5: Break Things Intentionally

Change types on purpose to see error messages. This helps you learn boundaries.

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'typescript'"

```bash
npm install
```

### Error: "tsc: command not found"

```bash
# Use npx instead
npx tsc --version
```

### VS Code Not Showing Type Hints?

1. Reload VS Code: `Cmd+Shift+P` → "Reload Window"
2. Check if TypeScript version is correct: Bottom right corner
3. Make sure you're in a `.ts` file (not `.js`)

### Types Are All `any`?

Make sure you have a `tsconfig.json` in your project root (we provide this).

---

## 📊 Progress Tracking

### Update Your Progress

After completing each day, update your README.md:

```markdown
Day 1: The Guard [██████████] 100% ✅
Day 2: The Factory [░░░░░░░░░░] 0%
Day 3: The Toolkit [░░░░░░░░░░] 0%
BONUS: The Real World [░░░░░░░░░░] 0%
```

### Check Your Achievements

Edit [ACHIEVEMENTS.md](ACHIEVEMENTS.md) to track your unlocked badges!

---

## 🎯 Your Learning Path

### Day 1: Monday (or your Day 1)

- ⏰ **Time Needed**: 2-3 hours
- 📖 Topic: Unions & Narrowing
- 🎯 Goal: Handle multiple states safely

### Day 2: Tuesday (or your Day 2)

- ⏰ **Time Needed**: 2-3 hours
- 📖 Topic: Generics
- 🎯 Goal: Build reusable type-safe functions

### Day 3: Wednesday (or your Day 3)

- ⏰ **Time Needed**: 2-3 hours
- 📖 Topic: Utility Types
- 🎯 Goal: Transform types like a pro

### Bonus Day: Thursday (or your Day 4)

- ⏰ **Time Needed**: 3-4 hours
- 📖 Topic: Socket.io + TypeScript
- 🎯 Goal: Build real-time type-safe apps

---

## ☕ Taking Breaks

**Important:** This is a speed run, but not a sprint!

Take breaks every 60-90 minutes:

- 🚶 Walk around
- 💧 Hydrate
- 👀 Look away from the screen
- 🧠 Let concepts sink in

Learning happens during rest, not just during coding!

---

## 🚀 Ready to Start?

**Complete this checklist:**

- [ ] Node.js installed
- [ ] TypeScript installed
- [ ] VS Code set up with extensions
- [ ] Project dependencies installed (`npm install`)
- [ ] Test compile works (`npm run check`)
- [ ] Read this entire guide
- [ ] Feeling excited! 🔥

**All checked?** → [Start Day 1: The Guard](day-1-the-guard/LESSON.md)

---

## 🆘 Still Need Help?

### Common Questions:

**Q: Do I need to complete all challenges?**  
A: The main challenges are required. Bonus challenges are optional but highly recommended!

**Q: Can I skip ahead?**  
A: Each day builds on the previous one. Don't skip unless you're already familiar with the topic.

**Q: How long should I spend if I'm stuck?**  
A: Struggle for 15-20 minutes, then check hints. Still stuck after 30 mins? Check the solution.

**Q: What if I finish early?**  
A: Try the nightmare mode challenges or build your own variations!

---

<div align="center">

### 🎮 "Every expert was once a beginner. The difference? They started." 🎮

**Now go crush Day 1!** 💪

[→ Start Your Journey](day-1-the-guard/LESSON.md)

</div>
