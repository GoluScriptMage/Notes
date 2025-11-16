// ============================================
// 07: TYPING REACT PROPS
// ============================================

// ## The Concept:
// In React, components receive data via "props". TypeScript lets you define
// exactly what props a component expects using `interface` or `type`. This gives
// you autocomplete, catches typos, and makes your components self-documenting.
// Think of prop types as a contract: "If you use this component, you MUST pass
// these props with these types."

// ## Code Example:

// ===== Basic Props Interface =====

import React from "react"; // Note: You'd need React installed for this to run

// Define the shape of props using interface:
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean; // Optional prop
}

// Functional component with typed props:
const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
}) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

// Usage (TypeScript will enforce these props):
// <Button label="Click Me" onClick={() => console.log("Clicked!")} />
// <Button label="Submit" onClick={handleSubmit} disabled={true} />

// ❌ This would error:
// <Button /> // Error: Missing required props 'label' and 'onClick'
// <Button label={42} onClick={...} /> // Error: 'label' must be string

// ===== Props with Children =====

interface CardProps {
  title: string;
  children: React.ReactNode; // Any valid JSX
}

const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  );
};

// Usage:
// <Card title="Profile">
//   <p>This is the card content</p>
// </Card>

// ===== Props with Event Handlers =====

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const Input: React.FC<InputProps> = ({ value, onChange, placeholder }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
};

// ===== Props with Union Types =====

interface AlertProps {
  message: string;
  type: "info" | "warning" | "error" | "success"; // Only these values allowed
}

const Alert: React.FC<AlertProps> = ({ message, type }) => {
  const styles = {
    info: "blue",
    warning: "yellow",
    error: "red",
    success: "green",
  };

  return <div style={{ color: styles[type] }}>{message}</div>;
};

// Usage:
// <Alert message="Operation successful" type="success" />
// <Alert message="Warning" type="danger" /> // ❌ Error: 'danger' is not valid

// ===== Props with Generic Components =====

interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Usage:
// <List
//   items={[1, 2, 3]}
//   renderItem={(num) => <span>Number: {num}</span>}
// />

// <List
//   items={["Alice", "Bob", "Charlie"]}
//   renderItem={(name) => <span>Name: {name}</span>}
// />

// ===== Type vs Interface for Props =====

// Both work, but interface is more conventional in React:

// ✅ Common (interface):
interface UserCardProps {
  name: string;
  age: number;
}

// ✅ Also valid (type):
type UserCardPropsAlt = {
  name: string;
  age: number;
};

// Pro tip: Use interface for props unless you need union types

// ============================================
// ## The Problem:
// ============================================
// You're building a user profile component. Create a component that displays
// user information with type-safe props.

// ✏️ YOUR TASK:

// 1. Create an interface called `UserProfileProps` with these properties:
//    - name: string (required)
//    - email: string (required)
//    - age: number (required)
//    - bio: string (optional)
//    - role: "admin" | "user" | "guest" (required, must be one of these)
//    - onContactClick: function that takes no parameters and returns void (required)

// 2. Create a functional component called `UserProfile` that:
//    - Accepts props matching your interface
//    - Displays the user information in a structured format
//    - Shows "No bio provided" if bio is not present
//    - Includes a "Contact" button that calls onContactClick

// 3. Create example usage (commented out) showing how to use the component

// Starter code:

// interface UserProfileProps {
//   // TODO: Define the props
// }

// const UserProfile: React.FC<UserProfileProps> = (props) => {
//   // TODO: Destructure props and render the component
//   return (
//     <div className="user-profile">
//       {/* Display user info here */}
//     </div>
//   );
// };

// Example usage (uncomment to test):
// const App = () => {
//   return (
//     <UserProfile
//       name="Alice Johnson"
//       email="alice@example.com"
//       age={28}
//       bio="Full-stack developer passionate about TypeScript"
//       role="admin"
//       onContactClick={() => alert("Contact clicked!")}
//     />
//   );
// };

// ============================================
// BONUS CHALLENGE: Generic Component
// ============================================

// Create a generic `DataDisplay` component that:
// - Takes a `data` prop of any type T
// - Takes a `render` function that transforms T into a string
// - Displays the rendered string in a <div>

// Example usage:
// <DataDisplay data={42} render={(num) => `Number: ${num}`} />
// <DataDisplay data={{ name: "Alice" }} render={(user) => `User: ${user.name}`} />

// interface DataDisplayProps<T> {
//   // TODO: Define generic props
// }

// function DataDisplay<T>({ data, render }: DataDisplayProps<T>) {
//   // TODO: Implement component
// }

// ============================================
// 🎉 CONGRATULATIONS!
// ============================================
// You've completed the TypeScript fundamentals journey!
//
// You now know:
// ✅ Basic types and type annotations
// ✅ Arrays and tuples
// ✅ Object and function typing
// ✅ Type aliases vs interfaces
// ✅ Union and intersection types
// ✅ Generics (the power tool!)
// ✅ React props with TypeScript
//
// Next steps:
// - Practice by converting an existing JavaScript project to TypeScript
// - Learn about utility types (Partial, Pick, Omit, etc.)
// - Explore advanced patterns (discriminated unions, conditional types)
// - Check out the official TypeScript handbook: typescriptlang.org
