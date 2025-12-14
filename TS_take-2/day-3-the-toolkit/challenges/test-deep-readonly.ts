interface User {
  id: number;
  name: string;
  address: {
    street: string;
    city: string;
    country: string;
  };
  preferences: {
    theme: "light" | "dark";
    notifications: {
      email: boolean;
      sms: boolean;
    };
  };
}

type DeepReadonly<T> = Readonly<T>;

type ReadonlyUser = DeepReadonly<User>;

const user: ReadonlyUser = {
  id: 1,
  name: "Alice",
  address: {
    street: "123 Main St",
    city: "NYC",
    country: "USA"
  },
  preferences: {
    theme: "light",
    notifications: {
      email: true,
      sms: false
    }
  }
};

// Test 1: Can we mutate top-level?
// user.name = "Bob";  // This SHOULD error

// Test 2: Can we mutate nested?
user.address.city = "LA";  // This SHOULD error but...

console.log("If this runs, nested mutation is NOT blocked!");
console.log(user.address.city);
