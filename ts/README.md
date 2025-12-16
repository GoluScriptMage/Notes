# TypeScript Power Features Mastery Course

> **Warning**: This is NOT a beginner course. We skip basics and dive straight into advanced type manipulation.

## 🎯 Course Philosophy

- **Skip the Obvious**: No `string | number` tutorials here
- **Focus on Logic**: Learn to manipulate types like a programming language
- **Brutal Drills**: Code that looks right but breaks - fix it with advanced types
- **High ROI**: Features that scale complex systems

---

## 📚 Curriculum Structure

### [Session 1: The Logic Gates](./session-1-logic-gates/)

**Unions & Narrowing Mastery**

- Discriminated Unions that actually matter
- Type Guards that save your sanity
- Pattern matching with exhaustive checks
- **Drill**: Fix broken NetworkResponse handlers

### [Session 2: The Shape Shifters](./session-2-shape-shifters/)

**Generics as Type Functions**

- Generics as type-level programming
- Constraint-based type manipulation
- Building flexible API wrappers
- **Drill**: Create type-safe `wrapInArray<T>` function

### [Session 3: The Toolbelt](./session-3-toolbelt/)

**Utility Types for System Architecture**

- `Partial`, `Pick`, `Omit`, `Record` in real scenarios
- Transforming complex interfaces
- Building form types from entities
- **Drill**: Transform massive User interface efficiently

---

## 🔥 How to Use This Course

1. **Read the Challenge** - Each session starts with broken code
2. **Attempt the Fix** - Use advanced TypeScript features
3. **Compare Solutions** - Check `solutions/` folder for detailed explanations
4. **Level Up** - Move to next session only after mastering current one

---

## ⚡ Quick Start

```bash
# Navigate to any session
cd session-1-logic-gates/

# Open the challenge
code challenge.ts

# Run TypeScript compiler to see ALL errors
npx tsc --noEmit
```

---

## 🎖️ Mastery Levels

- **Apprentice**: Can fix the basic challenges
- **Journeyman**: Can explain why the fixes work
- **Master**: Can create new patterns using the same principles

**Ready to get your hands dirty? Start with [Session 1](./session-1-logic-gates/).**
