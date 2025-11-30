# 🚀 Tier 4: The Advanced Layer - React Query Deep Dive

> **"Let's understand the WHY and HOW behind React Query, not just the code!"**

---

## 🤔 **Quick Check: Do You Remember This Pain?**

**Question:** When you used `useState` + `useEffect` for data fetching, what annoying problems did you face?

<details>
<summary>Click to reveal the pain points...</summary>

- **Duplicate loading states** across components
- **Cache miss** - refetching same data multiple times
- **Stale data** - not knowing when to refresh
- **Manual error handling** in every component
- **Race conditions** - old requests overwriting new ones
- **Memory leaks** from forgotten cleanup

</details>

**That's exactly what React Query solves!** 🎯

---

## 🧠 **Understanding React Query: The Mental Model**

### **🏪 Analogy: React Query as a Smart Grocery Store Manager**

Imagine you're running a **grocery store** (your React app) and React Query is your **smart store manager**:

```
🏪 Your Store (React App)
├── 👥 Customers (Components)
├── 📦 Products (Data)
└── 🤖 Manager (React Query)
```

**Here's how the manager works:**

1. **Customer asks for milk** → Component requests data
2. **Manager checks storage** → Query cache lookup
3. **If fresh milk exists** → Return cached data instantly
4. **If milk is stale** → Fetch fresh milk from supplier (API)
5. **Store fresh milk** → Cache the response
6. **Serve to customer** → Update component with data

**💡 Quick Question:** What happens when another customer asks for the same milk?

<details>
<summary>Answer</summary>
The manager gives them the SAME fresh milk from storage - no need to call supplier again! (Cache hit)
</details>

---

## 🔍 **React Query Core Concepts - The WHY Behind Each**

### **1. Query Keys - The "Address System"**

**Think of it like:** Pizza delivery addresses

```jsx
// Bad address - pizza gets lost
useQuery("tasks", fetchTasks); // Too vague!

// Good address - pizza arrives perfectly
useQuery(["tasks", "user123", "status:todo"], fetchTasks);
```

**Why Query Keys Matter:**

- **Uniquely identify** each piece of data
- **Cache separation** - user A's tasks ≠ user B's tasks
- **Smart invalidation** - only refresh what changed

**🤔 Quick Test:** If you have tasks filtered by status, what should the query key be?

<details>
<summary>Answer</summary>

```jsx
useQuery(["tasks", { status: "todo" }], fetchTasks);
```

Different status = different cache entry = no conflicts!

</details>

---

### **2. Stale Time vs Cache Time - The Fresh Food Analogy**

**Analogy:** Your refrigerator food management

```
📅 Stale Time = "Best Before Date"
📦 Cache Time = "How long to keep expired food"
```

**Stale Time (freshness):**

```jsx
staleTime: 5 * 60 * 1000; // 5 minutes
// "This data is fresh for 5 minutes"
// Like: "This milk is good until 3 PM"
```

**Cache Time (storage):**

```jsx
cacheTime: 10 * 60 * 1000; // 10 minutes
// "Keep stale data for 10 minutes"
// Like: "Keep expired milk for 10 minutes in case someone needs it"
```

**💡 Real Scenario:**

- User opens Tasks page → Data fetched & cached (fresh)
- User switches to Profile → Tasks still fresh in cache
- User returns to Tasks → Instant load (no API call!)
- After 5 minutes → Data marked stale
- User returns → Show cached data + refetch in background

**🤔 Quick Question:** What happens if staleTime = 0?

<details>
<summary>Answer</summary>
Data is ALWAYS considered stale - React Query refetches on every component mount!
</details>

---

### **3. Background Refetching - The Silent Waiter**

**Analogy:** A waiter who refills your water without asking

**The Magic:**

```jsx
const { data } = useQuery(["tasks"], fetchTasks, {
  refetchOnWindowFocus: true, // User returns to tab
  refetchOnReconnect: true, // Internet comes back
  refetchInterval: 30000, // Every 30 seconds
});
```

**What's happening behind the scenes:**

1. **Component shows cached data instantly** (no loading spinner)
2. **React Query silently fetches fresh data** in background
3. **UI updates smoothly** when fresh data arrives
4. **User never sees loading states** for background updates

**🎯 Why This is Magical:**

- **Instant UI** - always show something
- **Always fresh** - data updates automatically
- **No loading fatigue** - users don't see unnecessary spinners

---

## 🛠️ **useQuery Deep Dive - How It Actually Works**

### **The useQuery Lifecycle**

```jsx
const { data, isLoading, isFetching, isStale } = useQuery({
  queryKey: ["tasks"],
  queryFn: fetchTasks,
});
```

**Step-by-step breakdown:**

```
1️⃣ Component mounts
   ↓
2️⃣ React Query checks cache for ["tasks"]
   ↓
3️⃣ Cache miss? → isLoading: true, isFetching: true
   ↓
4️⃣ fetchTasks() called
   ↓
5️⃣ Data received → cache stored, isLoading: false
   ↓
6️⃣ Component re-renders with data
   ↓
7️⃣ After staleTime → isStale: true
   ↓
8️⃣ Next mount → show cached data + background fetch
```

**🤔 Pop Quiz:** What's the difference between `isLoading` and `isFetching`?

<details>
<summary>Answer</summary>

- **isLoading** = No cached data exists, fetching for first time
- **isFetching** = Actively making a request (might have cached data)

Example:

- First visit: `isLoading: true, isFetching: true`
- Background refresh: `isLoading: false, isFetching: true`
</details>

---

## ⚡ **useMutation - The Action Hero**

### **Queries vs Mutations: The Difference**

**Analogy:** Reading a book vs Writing in a book

```
📖 useQuery = Reading a book
- Safe operation
- Can be repeated
- Doesn't change anything

✏️ useMutation = Writing in a book
- Changes something
- Should be triggered by user action
- Can fail and need rollback
```

### **The useMutation Lifecycle**

```jsx
const mutation = useMutation({
  mutationFn: createTask,
  onSuccess: (data) => {
    // ✅ Task created successfully
  },
  onError: (error) => {
    // ❌ Something went wrong
  },
});

// Trigger the mutation
mutation.mutate({ title: "New Task" });
```

**What happens internally:**

```
1️⃣ mutation.mutate() called
   ↓
2️⃣ isPending: true (show loading state)
   ↓
3️⃣ mutationFn(variables) executes
   ↓
4️⃣ Success? → onSuccess() → isPending: false
   ❌ Error? → onError() → isError: true
```

**🎯 Key Insight:** Mutations don't cache like queries - they're one-time actions!

---

## 🚀 **Optimistic Updates - The Future Prediction**

### **Analogy: Pre-ordering Your Coffee**

**Normal Flow (Pessimistic):**

```
You: "One coffee please"
Barista: "Making it..." (you wait)
Barista: "Here's your coffee"
You: Drink coffee ☕
```

**Optimistic Flow:**

```
You: "One coffee please"
You: Start drinking (imaginary coffee) ☕
Barista: "Making it..." (you're already "satisfied")
Barista: "Here's your coffee" (replace imaginary with real)
```

**In React Query:**

```jsx
const mutation = useMutation({
  mutationFn: toggleTask,

  // 🔮 BEFORE server responds
  onMutate: async (taskId) => {
    // 1. Cancel any ongoing fetches
    await queryClient.cancelQueries(["tasks"]);

    // 2. Snapshot current state (for rollback)
    const previousTasks = queryClient.getQueryData(["tasks"]);

    // 3. Optimistically update UI
    queryClient.setQueryData(["tasks"], (old) =>
      old.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );

    // 4. Return snapshot for potential rollback
    return { previousTasks };
  },

  // ❌ Server said NO - rollback!
  onError: (err, variables, context) => {
    queryClient.setQueryData(["tasks"], context.previousTasks);
  },
});
```

**Why Optimistic Updates Feel Magical:**

- **Instant feedback** - UI responds immediately
- **No loading states** - user sees their action instantly
- **Automatic rollback** - if server fails, UI reverts smoothly
- **Instagram-like experience** - like when you "like" a post

**🤔 When to Use Optimistic Updates:**
✅ Toggle states (like/unlike, complete/incomplete)
✅ Simple edits (rename, priority change)
❌ Complex operations (file uploads, payments)
❌ Operations that might fail often

---

## 🎯 **Query Invalidation - The Smart Refresh**

### **Analogy: Expiring Food in Your Fridge**

When you add new groceries, some old food might need checking:

```jsx
// After creating a new task
queryClient.invalidateQueries(["tasks"]);
// "Hey, the tasks list might be outdated now - go check!"

// After updating user profile
queryClient.invalidateQueries(["user", userId]);
// "This specific user's data needs refreshing"

// Nuclear option - refresh everything
queryClient.invalidateQueries();
// "Everything in the fridge is suspicious - check it all!"
```

**Smart Invalidation Patterns:**

```jsx
// ✅ Specific invalidation
onSuccess: () => {
  queryClient.invalidateQueries(["tasks"]);
  queryClient.invalidateQueries(["tasks", "completed"]);
};

// ❌ Over-invalidation (wasteful)
onSuccess: () => {
  queryClient.invalidateQueries(); // Refetches EVERYTHING!
};
```

---

## 🔗 **How React Query Connects to Your Backend**

### **The Query Function Bridge**

```jsx
const { data } = useQuery({
  queryKey: ["tasks"],
  queryFn: async () => {
    // This function is the bridge to your backend
    const response = await axios.get("/api/tasks", {
      withCredentials: true, // Your OAuth cookies
    });
    return response.data.data; // Return just the tasks array
  },
});
```

**What's happening:**

1. **React Query** → Calls your `queryFn`
2. **queryFn** → Makes HTTP request to your Express server
3. **Express server** → Checks `req.isAuthenticated()` (Passport.js)
4. **Express server** → Queries MongoDB for user's tasks
5. **Express server** → Returns JSON response
6. **queryFn** → Extracts data and returns to React Query
7. **React Query** → Caches data and updates component

**🎯 This is why your OAuth setup from Tier 3 is crucial!**

---

## 💡 **Interactive Quick Questions**

### **🧠 Test 1: Cache Behavior**

```jsx
// Component A
const { data } = useQuery(["user", "123"], fetchUser);

// Component B (rendered at same time)
const { data } = useQuery(["user", "123"], fetchUser);
```

**Question:** How many API calls are made?

<details>
<summary>Answer</summary>
**ONE API call!** Both components share the same cache entry because they have identical query keys.
</details>

---

### **🧠 Test 2: Stale Time Logic**

```jsx
useQuery(["tasks"], fetchTasks, {
  staleTime: 1000 * 60 * 5, // 5 minutes
});
```

**Scenario:** User fetches tasks at 2:00 PM, then navigates away and returns at 2:03 PM.

**Question:** What happens?

<details>
<summary>Answer</summary>
**Instant load!** Data is still fresh (only 3 minutes old), so cached data shows immediately with NO API call.
</details>

---

### **🧠 Test 3: Mutation Side Effects**

```jsx
const createTask = useMutation({
  mutationFn: postTask,
  onSuccess: () => {
    // What should go here?
  },
});
```

**Question:** After successfully creating a task, what should you do?

<details>
<summary>Answer</summary>

```jsx
onSuccess: () => {
  queryClient.invalidateQueries(["tasks"]);
  // OR for better UX:
  queryClient.setQueryData(["tasks"], (old) => [...old, newTask]);
};
```

Either invalidate to refetch, or manually add the new task to cache!

</details>

---

## 🎓 **Mental Model Summary**

**React Query is like having a super-smart assistant who:**

1. **Remembers everything** (caching)
2. **Knows when to refresh** (stale time)
3. **Works in the background** (background refetching)
4. **Handles failures gracefully** (error states)
5. **Predicts the future** (optimistic updates)
6. **Keeps things organized** (query keys)

**The result:** Your app feels incredibly fast and responsive, just like the apps you used to build! 🚀

---

## 🔥 **Ready to Build?**

Now that you understand the **WHY** and **HOW**, let's put it into practice:

1. **[Auth-Context-Pattern.md](./Auth-Context-Pattern.md)** - See how React Query powers authentication
2. **[Practice-Questions.md](./Practice-Questions.md)** - Test your deep understanding
3. **[Mission-Checklist.md](./Mission-Checklist.md)** - Build the complete implementation

**You now understand React Query at a conceptual level - exactly what you needed!** 🎯

---

## 🛠️ **Practical Implementation - The "How To" Section**

Now that you understand the **WHY**, let's see clean, practical implementations:

### **1. Setting Up React Query (The Foundation)**

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

**File: `src/main.jsx`** - Your app's brain center:

```jsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Fresh for 5 min (like our grocery analogy)
      cacheTime: 1000 * 60 * 10, // Keep in storage for 10 min
      refetchOnWindowFocus: false, // Don't refetch when tab switches
      retry: 2, // Retry failed requests 2 times
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
```

**🤔 Why these specific settings?**

- **5 min stale time**: Good balance between freshness and performance
- **10 min cache**: Keep data even when stale for instant loading
- **No focus refetch**: Prevent unnecessary API calls when switching tabs
- **2 retries**: Handle network hiccups without overwhelming server

---

### **2. useQuery in Practice**

**Basic useQuery Pattern:**

```jsx
import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

function TaskList() {
  const {
    data: tasks,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await api.get("/api/tasks");
      return response.data.data; // Extract the tasks array
    },
  });

  // Smart loading states
  if (isLoading) return <div className="loading">Loading your tasks...</div>;
  if (error) return <div className="error">Oops! {error.message}</div>;

  return (
    <div>
      <button onClick={() => refetch()}>🔄 Refresh</button>
      {tasks?.map((task) => (
        <TaskCard key={task._id} task={task} />
      ))}
    </div>
  );
}
```

**Advanced: Dynamic Query Keys**

```jsx
function TaskList({ status, priority, userId }) {
  const { data: tasks } = useQuery({
    queryKey: ["tasks", { status, priority, userId }],
    queryFn: async () => {
      const response = await api.get("/api/tasks", {
        params: { status, priority, userId },
      });
      return response.data.data;
    },
    // Only run if we have required data
    enabled: !!userId,
  });

  // When status/priority changes, React Query auto-refetches!
}
```

---

### **3. useMutation with Smart Updates**

```jsx
import { useMutation, useQueryClient } from "@tanstack/react-query";

function CreateTaskForm() {
  const queryClient = useQueryClient();

  const createTask = useMutation({
    mutationFn: async (newTask) => {
      const response = await api.post("/api/tasks", newTask);
      return response.data.data;
    },

    onSuccess: (newTask) => {
      // Method 1: Invalidate (refetch from server)
      queryClient.invalidateQueries(["tasks"]);

      // Method 2: Manual update (faster, no network)
      // queryClient.setQueryData(["tasks"], old => [...old, newTask]);
    },

    onError: (error) => {
      toast.error(`Failed to create task: ${error.message}`);
    },
  });

  const handleSubmit = (formData) => {
    createTask.mutate({
      title: formData.title,
      priority: formData.priority,
      status: "todo",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Task title..." />
      <button type="submit" disabled={createTask.isPending}>
        {createTask.isPending ? "Creating..." : "Create Task"}
      </button>
    </form>
  );
}
```

---

### **4. Axios Interceptors (Error Handling Autopilot)**

**File: `src/utils/api.js`**

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, // Important for your OAuth cookies!
});

// Request interceptor - runs before every request
api.interceptors.request.use(
  (config) => {
    // Add auth headers, log requests, etc.
    console.log(`📡 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handles errors globally
api.interceptors.response.use(
  (response) => response, // Success - just pass through
  (error) => {
    const status = error.response?.status;

    switch (status) {
      case 401:
        // Unauthorized - redirect to login
        window.location.href = "/auth/google";
        break;
      case 403:
        // Forbidden
        toast.error("You don't have permission for this action");
        break;
      case 500:
        // Server error
        toast.error("Server error. Please try again later.");
        break;
      default:
        // Generic error
        toast.error(error.message || "Something went wrong");
    }

    return Promise.reject(error);
  }
);

export default api;
```

**🎯 Now every API call automatically handles errors!**

---

### **5. TypeScript Integration (Type Safety)**

**File: `src/types/index.ts`**

```typescript
export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
```

**Using with React Query:**

```tsx
import { Task, ApiResponse } from "../types";

function TaskList() {
  const { data: tasks } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async (): Promise<Task[]> => {
      const response = await api.get<ApiResponse<Task[]>>("/api/tasks");
      return response.data.data;
    },
  });

  // TypeScript now knows tasks is Task[] or undefined
  return (
    <div>
      {tasks?.map((task: Task) => (
        <div key={task._id}>
          {task.title} - {task.status} {/* Full autocomplete! */}
        </div>
      ))}
    </div>
  );
}
```

---

### **6. Connecting to Your OAuth Backend**

**Remember your backend from Tier 3?** Here's how React Query connects:

```jsx
// Your AuthContext using React Query
export const AuthProvider = ({ children }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["auth-status"],
    queryFn: async () => {
      const response = await api.get("/auth/status");
      return response.data; // { isAuthenticated: true, user: {...} }
    },
    retry: false, // Don't retry if user is not logged in
    staleTime: 1000 * 60 * 5, // Check auth every 5 minutes
  });

  const contextValue = {
    user: data?.isAuthenticated ? data.user : null,
    isLoading,
    isAuthenticated: !!data?.isAuthenticated,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
```

**🔗 This connects directly to your Express `/auth/status` route!**

---

## 🎯 **Quick Reference Card**

| **Concept**            | **When to Use**            | **Key Pattern**                   |
| ---------------------- | -------------------------- | --------------------------------- |
| **useQuery**           | Fetching/reading data      | `queryKey + queryFn`              |
| **useMutation**        | Creating/updating/deleting | `mutationFn + onSuccess`          |
| **Query Keys**         | Cache identification       | `["tasks", filters]`              |
| **Invalidation**       | Refresh after mutations    | `queryClient.invalidateQueries()` |
| **Optimistic Updates** | Instant UI feedback        | `onMutate + rollback`             |
| **Stale Time**         | How long data stays fresh  | `staleTime: 5 * 60 * 1000`        |

---

## 🚀 **Ready to Connect Everything?**

Your journey continues here:

1. **[Auth-Context-Pattern.md](./Auth-Context-Pattern.md)** - Connect React Query to your OAuth backend
2. **[Practice-Questions.md](./Practice-Questions.md)** - Test your conceptual understanding
3. **[Mission-Checklist.md](./Mission-Checklist.md)** - Build the complete implementation

**You now have both the WHY and the HOW - exactly what you needed to rebuild your React Query mastery!** 🎯🔥
