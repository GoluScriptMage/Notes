# 🧠 Tier 4: Practice Questions

> **"React Query and modern patterns - this is where you become unstoppable!"**

---

## Question 1: React Query vs useState

**Q:** What's the difference between these two approaches?

**Traditional useState:**

```jsx
const [tasks, setTasks] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  setLoading(true);
  fetch("/api/tasks")
    .then((res) => res.json())
    .then((data) => {
      setTasks(data);
      setLoading(false);
    });
}, []);
```

**React Query:**

```jsx
const { data: tasks, isLoading } = useQuery({
  queryKey: ["tasks"],
  queryFn: () => fetch("/api/tasks").then((res) => res.json()),
});
```

<details>
<summary>Click to reveal answer</summary>

**Answer:**

**React Query advantages:**

- **Automatic caching** - Data is cached and reused
- **Background refetching** - Keeps data fresh automatically
- **Loading states** - `isLoading`, `isError`, `isSuccess` built-in
- **Optimistic updates** - Update UI before server responds
- **Retry logic** - Automatically retries failed requests
- **Deduplication** - Multiple components requesting same data = single request

**useState approach:**

- Manual state management
- No caching (refetch every time)
- Manual loading states
- No retry logic
- Each component makes separate requests

**React Query turns you from "state manager" to "data orchestrator"!**

</details>

---

## Question 2: Query Keys

**Q:** Why do these have different query keys?

```jsx
// Query 1
const { data } = useQuery({
  queryKey: ["tasks"],
  queryFn: () => fetchTasks(),
});

// Query 2
const { data } = useQuery({
  queryKey: ["tasks", "completed"],
  queryFn: () => fetchTasks({ status: "completed" }),
});

// Query 3
const { data } = useQuery({
  queryKey: ["tasks", userId, "completed"],
  queryFn: () => fetchUserTasks(userId, { status: "completed" }),
});
```

<details>
<summary>Click to reveal answer</summary>

**Answer:**

**Query keys determine caching and refetching behavior:**

- **`['tasks']`** - All tasks (global cache)
- **`['tasks', 'completed']`** - Only completed tasks (separate cache)
- **`['tasks', userId, 'completed']`** - User-specific completed tasks (user-scoped cache)

**Key Rules:**

1. **Different keys = Different cache entries**
2. **Keys should be descriptive of the data**
3. **Include all variables that affect the query**

**Example:**

```jsx
// ❌ BAD: userId changes but key doesn't
const { data } = useQuery({
  queryKey: ["tasks"],
  queryFn: () => fetchUserTasks(userId), // userId not in key!
});

// ✅ GOOD: Key includes all variables
const { data } = useQuery({
  queryKey: ["tasks", userId],
  queryFn: () => fetchUserTasks(userId),
});
```

</details>

---

## Question 3: useMutation vs useQuery

**Q:** When do you use `useQuery` vs `useMutation`?

<details>
<summary>Click to reveal answer</summary>

**Answer:**

**useQuery - For READING data:**

```jsx
// ✅ GET requests - fetching data
const { data, isLoading } = useQuery({
  queryKey: ["tasks"],
  queryFn: () => api.get("/tasks"),
});
```

**useMutation - For CHANGING data:**

```jsx
// ✅ POST/PUT/DELETE - modifying data
const mutation = useMutation({
  mutationFn: (newTask) => api.post("/tasks", newTask),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  },
});
```

**Key Differences:**

| **useQuery**        | **useMutation**         |
| ------------------- | ----------------------- |
| Automatic execution | Manual execution        |
| Caching             | No caching              |
| Background refetch  | One-time operation      |
| GET requests        | POST/PUT/DELETE         |
| `data`, `isLoading` | `mutate()`, `isPending` |

</details>

---

## Question 4: Optimistic Updates

**Q:** What does this optimistic update do?

```jsx
const mutation = useMutation({
  mutationFn: (taskId) => api.patch(`/tasks/${taskId}`, { status: "done" }),

  onMutate: async (taskId) => {
    await queryClient.cancelQueries({ queryKey: ["tasks"] });
    const previousTasks = queryClient.getQueryData(["tasks"]);

    queryClient.setQueryData(["tasks"], (old) =>
      old.map((task) =>
        task.id === taskId ? { ...task, status: "done" } : task
      )
    );

    return { previousTasks };
  },

  onError: (err, variables, context) => {
    queryClient.setQueryData(["tasks"], context.previousTasks);
  },
});
```

<details>
<summary>Click to reveal answer</summary>

**Answer:**

**This implements optimistic task completion:**

**Flow:**

1. **User clicks "Mark Done"**
2. **onMutate runs IMMEDIATELY:**
   - Cancels background refetches
   - Saves current tasks as backup
   - **Updates UI instantly** (task appears completed)
3. **API call happens in background**
4. **If successful:** UI already shows correct state ✅
5. **If error:** Rollback to previous state ❌

**User Experience:**

- **Feels instant** - No waiting for server
- **Handles failures gracefully** - Rollback if error
- **Professional UX** - Like Instagram likes, Twitter favorites

**This is why apps feel "snappy" vs slow/loading constantly!**

</details>

---

## Question 5: Global Auth Context

**Q:** What's happening in this Auth Context pattern?

```jsx
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["authStatus"],
    queryFn: () => api.get("/auth/status"),
    retry: false,
  });

  const user = data?.isAuthenticated ? data.user : null;

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

<details>
<summary>Click to reveal answer</summary>

**Answer:**

**This creates a global auth system:**

1. **`useQuery(['authStatus'])`** - Calls your `/auth/status` endpoint
2. **`retry: false`** - Don't retry if user is not logged in (401 is expected)
3. **`data?.isAuthenticated`** - Safely checks if user is authenticated
4. **Context provides `user` and `isLoading`** to entire app

**Usage in components:**

```jsx
function Dashboard() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Loading />;
  if (!user) return <Navigate to="/login" />;

  return <h1>Welcome, {user.name}!</h1>;
}
```

**Why this pattern rocks:**

- **Single source of truth** for auth state
- **Automatic refetching** when needed
- **Works with your OAuth backend**
- **Type-safe with TypeScript**

</details>

---

## Question 6: Axios Interceptors

**Q:** What do these interceptors do?

```jsx
// Request interceptor
api.interceptors.request.use((config) => {
  console.log("Request:", config.method, config.url);
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

<details>
<summary>Click to reveal answer</summary>

**Answer:**

**Request Interceptor:**

- Runs **before every request**
- Logs all API calls for debugging
- Could add auth headers, API keys, etc.

**Response Interceptor:**

- Runs **after every response**
- **Success:** Pass through normally
- **401 Unauthorized:** Automatically redirect to login
- **Global error handling** for entire app

**Benefits:**

- **DRY principle** - Handle auth/errors once, not in every component
- **Centralized logging** - See all API calls in one place
- **User experience** - Auto-redirect on session expiry
- **Debugging** - Track what's happening with requests

**Professional apps use interceptors for:**

- Auth token refresh
- Global error handling
- Request/response logging
- Loading indicators
- API rate limiting

</details>

---

## Question 7: TypeScript with React Query

**Q:** What do these TypeScript types provide?

```tsx
interface Task {
  _id: string;
  title: string;
  status: "todo" | "in-progress" | "done";
}

const { data } = useQuery<Task[]>({
  queryKey: ["tasks"],
  queryFn: async () => {
    const { data } = await api.get<{ data: Task[] }>("/api/tasks");
    return data.data;
  },
});
```

<details>
<summary>Click to reveal answer</summary>

**Answer:**

**Type Safety Benefits:**

1. **`interface Task`** - Defines exact shape of task objects
2. **`useQuery<Task[]>`** - `data` is typed as `Task[]` or `undefined`
3. **`api.get<{ data: Task[] }>`** - Response is typed

**What you get:**

```tsx
// ✅ TypeScript knows data is Task[] | undefined
data?.map((task) => (
  <div key={task._id}>
    {task.title} {/* ✅ Autocomplete works */}
    {task.status} {/* ✅ Only 'todo' | 'in-progress' | 'done' */}
  </div>
));

// ❌ TypeScript catches errors
task.ttile; // Error: Property 'ttile' does not exist
task.status = "completed"; // Error: not assignable to type
```

**Benefits:**

- **Autocomplete** in IDE
- **Catch bugs at compile time**
- **Self-documenting code**
- **Refactoring safety**
- **Team collaboration** (everyone knows the shape)

</details>

---

## 🎯 Challenge Question: Build a Complete Feature

**Task:** Using React Query, build a task management feature with:

1. **Fetch tasks** with filtering
2. **Create new task** with optimistic update
3. **Toggle task status** with optimistic update
4. **Delete task** with confirmation
5. **Global error handling**

Try building this yourself, then check the solution in **[Mission-Checklist.md](./Mission-Checklist.md)**!

---

**Ready to become a React Query master?** → [Go to Mission Checklist](./Mission-Checklist.md)

**Boss, you're almost at the advance level!** 🚀💪
