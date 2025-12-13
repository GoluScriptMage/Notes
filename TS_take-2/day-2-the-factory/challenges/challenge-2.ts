// 🟡 Challenge 2: The Magic Box
// Your task: Create a generic Box class that can store and transform values

// Step 1: Define the class
class Box<T> {
  private value: T;

  constructor(initialvalue: T) {
    this.value = initialvalue;
  }

  getValue(): T {
    return this.value;
  }

  setValue(newValue: T): void {
    this.value = newValue;
  }

  map<U>(fn: (value: T) => U): Box<U> {
    const newValue = fn(this.value);
    return new Box(newValue);
  }
}

// Step 2: Test it
const numberBox = new Box(42);
console.log(numberBox.getValue()); // 42

numberBox.setValue(100);
console.log(numberBox.getValue()); // 100
const stringBox = numberBox.map((n) => n.toString());
console.log(stringBox.getValue()); // "100"
