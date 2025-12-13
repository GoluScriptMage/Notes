// 🔴 Challenge 4: Generic Collection (Boss Fight!)
// Your task: Build a full-featured collection class

// Step 1: Define the class with all methods

class Collection<T> {
  private items: T[];

  constructor(initalArr?: T[]) {
    this.items = initalArr || [];
  }

  add(item: T): void {
    this.items.push(item);
  }

  remove(item: T): void {
    this.items = this.items.filter((i) => i !== item);
  }

  find(testFn: (item: T) => boolean): T | undefined {
    return this.items.find(testFn);
  }

  filter(testFn: (item: T) => boolean): Collection<T> {
    const value = this.items.filter(testFn);
    return new Collection(value);
  }

  map<U>(fn: (item: T) => U): Collection<U> {
    const value = this.items.map(fn);
    return new Collection(value);
  }

  toArray(): T[] {
    return [...this.items];
  }

  size(): number {
    return this.items.length;
  }

  clear(): void {
    this.items = [];
  }
}

// Step 2: Test itconst numbers = new Collection([1, 2, 3, 4, 5]);
const numbers = new Collection([1, 2, 3, 4, 5]);

numbers.add(6);
console.log(numbers.size()); // 6

const evens = numbers.filter((n) => n % 2 === 0);
console.log(evens.toArray()); // [2, 4, 6]

const strings = numbers.map((n) => n.toString());
console.log(strings.toArray()); // ["1", "2", "3", "4", "5", "6"]

const found = numbers.find((n) => n > 3);
console.log(found); // 4

numbers.remove(3);
console.log(numbers.toArray()); // [1, 2, 4, 5, 6]
