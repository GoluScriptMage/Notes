// 🔥 BONUS: Fluent Query Builder (Nightmare Mode!)
// Your task: Build a type-safe query builder with method chaining

// Step 1: Define your types
// interface User {
//   id: number
//   name: string
//   age: number
//   email: string
// }

// Step 2: Create the QueryBuilder class
// class QueryBuilder<T, TResult = T> {
//   // Your code here
// }

// Step 3: Test it
// const users: User[] = [
//   { id: 1, name: 'Alice', age: 30, email: 'alice@example.com' },
//   { id: 2, name: 'Bob', age: 25, email: 'bob@example.com' }
// ]

// const result1 = new QueryBuilder(users)
//   .where('age', 30)
//   .execute()

// const result2 = new QueryBuilder(users)
//   .where('age', 30)
//   .select('name', 'email')
//   .execute()

// console.log(result1)  // Full User objects
// console.log(result2)  // Only { name, email } objects
