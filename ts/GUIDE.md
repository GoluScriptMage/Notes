# 🚀 TypeScript Learning Roadmap

Welcome to your TypeScript journey! This guide contains **7 hands-on worksheets** designed to take you from TypeScript basics to building type-safe React components.

## 📋 How to Use This Guide

Each file contains:

1. **The Concept** - What it is and why it matters
2. **Code Example** - Working examples you can run and modify
3. **The Problem** - A hands-on challenge to cement your understanding

Work through the files **in order**. Don't skip ahead - each concept builds on the previous one.

---

## 📚 Learning Path

### **01-basic-types.ts**

> **Mission:** Master the 6 core TypeScript types and fix a broken function with incorrect type annotations.

**What you'll learn:** `string`, `number`, `boolean`, `any`, `unknown`, `void`, and why typing matters.

---

### **02-arrays-and-tuples.ts**

> **Mission:** Understand typed arrays and create a function that returns a fixed-length tuple with specific types.

**What you'll learn:** The difference between flexible arrays and rigid tuples, and when to use each.

---

### **03-objects-and-functions.ts**

> **Mission:** Write a function that takes a typed object and returns a formatted string with proper handling of optional properties.

**What you'll learn:** How to type function parameters, return values, and object shapes (including optional properties).

---

### **04-type-aliases-vs-interfaces.ts** ⭐ CRUCIAL

> **Mission:** Create a `ProductID` type (union) and a `Product` interface, then extend it into a `DigitalProduct`.

**What you'll learn:** The critical difference between `type` and `interface`, when to use each, and how to extend interfaces.

---

### **05-union-and-intersection.ts**

> **Mission:** Build a flexible function that accepts `string | number | boolean` and formats each differently using type narrowing.

**What you'll learn:** Union types (`|` for "OR"), intersection types (`&` for "AND"), and how to handle multiple possible types.

---

### **06-generics.ts** ⭐ VERY IMPORTANT

> **Mission:** Create a generic `wrapInArray()` function that works with ANY type while maintaining type safety.

**What you'll learn:** Generics - TypeScript's "variables for types" - the key to writing reusable, type-safe code.

---

### **07-react-props.ts** 🎯 GRAND FINALE

> **Mission:** Build a `<UserProfile />` component with a complete props interface including optional properties and union types.

**What you'll learn:** How to bring everything together to create production-ready, type-safe React components.

---

## 🎯 Quick Tips

- **Run the code!** Use `ts-node` or the TypeScript playground (typescriptlang.org/play) to test your solutions
- **Make mistakes on purpose** - Try passing the wrong types to see how TypeScript catches errors
- **Uncomment test cases** - Each file has commented examples; uncomment them to see types in action
- **Don't rush** - Spend 15-30 minutes on each file. Understanding beats speed.

---

## 🛠️ Setup (If Running Locally)

```bash
# Install TypeScript globally
npm install -g typescript ts-node

# Run a file
ts-node 01-basic-types.ts

# Or compile and run
tsc 01-basic-types.ts && node 01-basic-types.js
```

---

## 🏆 Completion Checklist

- [ ] **01-basic-types.ts** - Fixed the `calculateDiscount()` function
- [ ] **02-arrays-and-tuples.ts** - Created the `parseUser()` tuple function
- [ ] **03-objects-and-functions.ts** - Built the `formatUserProfile()` function
- [ ] **04-type-aliases-vs-interfaces.ts** - Defined `ProductID` type and `Product` interface
- [ ] **05-union-and-intersection.ts** - Implemented the `formatValue()` function with type narrowing
- [ ] **06-generics.ts** - Created the generic `wrapInArray()` function
- [ ] **07-react-props.ts** - Built the `<UserProfile />` component with typed props

---

## 🎓 After You Finish

Congratulations! You now have a solid TypeScript foundation. Next steps:

1. **Convert a JS project to TS** - Apply what you've learned to real code
2. **Learn utility types** - `Partial<T>`, `Pick<T>`, `Omit<T>`, `Record<K,T>`
3. **Dive deeper** - Conditional types, mapped types, template literal types
4. **Read the docs** - [Official TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

---

## 💬 Remember

> "TypeScript catches bugs before they reach production. The few extra minutes spent typing code saves hours of debugging later."

Happy learning! 🚀
