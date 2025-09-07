# Golu's React Router & Redux Cheatsheet! 🚀

Hey, Golu! Here are all the notes from our deep dive into React Router and Redux. Just give this a quick look after you practice, and you'll have all this stuff down in no time. You got this!

## Part 1: React Router

### 1. loader (for Grabbing Data)
So, what's a loader? It's basically a function that grabs the data for a page before it even shows up. Super handy!

The Cool Trick (Streaming Data ✨): Instead of waiting, just send the promise straight from your loader. This way, your page pops up instantly, and the data just fills in when it's ready. No more blank screens!

```javascript
// loader function
export function userLoader({ params }) {
  const userPromise = axios.get(`.../users/${params.userId}`).then(res => res.data);
  // Just return the promise in an object!
  return { user: userPromise };
}
```

### 2. `<Suspense>` & `<Await>` (for Handling Promises)
So, what do these do? They're like the perfect team for handling the promises your loader sends over. They make showing a loading message super easy!

Here's how you use 'em:

```jsx
import { Suspense } from "react";
import { useLoaderData, Await } from "react-router-dom";

function UserPage() {
  const { user } = useLoaderData(); // Gets the { user: Promise } object

  return (
    <Suspense fallback={<p>Loading user details...</p>}>
      <Await resolve={user}>
        {(loadedUser) => (
          <h2>{loadedUser.name}</h2>
        )}
      </Await>
    </Suspense>
  );
}
```

### 3. action (for Changing Data)
What's an action? It's your go-to for changing data! Think submitting forms, deleting stuff, or updating info. It kicks in whenever you submit a React Router `<Form>`.

Here's a quick look:

```jsx
import { Form, redirect } from "react-router-dom";

export async function createPostAction({ request }) {
  const formData = await request.formData();
  const postData = { title: formData.get('title') };

  try {
    await axios.post('/api/posts', postData);
    return redirect('/posts'); // Success! Off to a new page.
  } catch (error) {
    return { error: true, message: 'Oops, could not save post!' }; // Uh oh, send back an error.
  }
}
```

### 4. useActionData (for Getting Action Results)
And what does this do? This little hook grabs any data that your action sends back. It's perfect for showing error messages right on the form if something goes wrong!

Here's how:

```jsx
import { useActionData } from "react-router-dom";

function NewPostForm() {
  const actionData = useActionData(); 

  return (
    <>
      {actionData?.error && <p style={{color: 'red'}}>{actionData.message}</p>}
      <Form method="post">...</Form>
    </>
  );
}
```

### 5. useNavigation (to See What the Router's Doing)
What's this for? It's like a little spy that tells you exactly what the router is up to! Is it loading? Submitting a form? It's awesome for showing a loading spinner or disabling a button so you don't click it twice.

Check it out:

```jsx
import { useNavigation } from "react-router-dom";

function SubmitButton() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <button type="submit" disabled={isSubmitting}>
      {isSubmitting ? 'Saving...' : 'Save'}
    </button>
  );
}
```

### 6. useFetcher (for "Side Quests"!)
So, what's a fetcher? Think of it like a "side quest" for your app! It lets you talk to your loaders and actions in the background without changing the whole page. It's perfect for stuff like a newsletter signup form in the footer or a "like" button.

Here's an example:

```jsx
import { useFetcher } from "react-router-dom";

function NewsletterSignup() {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="post" action="/subscribe">
      <input type="email" name="email" />
      <button type="submit">Subscribe</button>
    </fetcher.Form>
  );
}
```

### 7. useSearchParams (for Playing with the URL)
What's this hook for? It's all about playing with the URL! You know, the stuff after the `?`. It's your best friend for building things like search filters or sorting options.

Quick look:

```jsx
import { useSearchParams } from "react-router-dom";

function ProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortOrder = searchParams.get('sort') || 'default';

  function handleSortChange(e) {
    setSearchParams(prev => ({...Object.fromEntries(prev.entries()), sort: e.target.value}));
  }

  return <select value={sortOrder} onChange={handleSortChange}>...</select>;
}
```

### 8. `<NavLink>` (for a Smart Link)
So, what's a NavLink? It's just a smarter `<Link>` that knows when it's "active." It's perfect for your navbar, so you can easily style the link of the page you're currently on!

Like this:

```jsx
import { NavLink } from "react-router-dom";

function MainNav() {
  return (
    <NavLink to="/profile" style={({ isActive }) => ({ color: isActive ? 'red' : 'black' })}>
      Profile
    </NavLink>
  );
}
```

### 9. Other Important Tools!
- **useParams**: Grabs the changing parts of your URL, like the id in `/users/123`.
- **useNavigate**: A hook you can use inside your components to send the user to a new page whenever you want, like after they click a button.
- **useRouteError**: This hook is what you use inside your special error page to get all the juicy details about what went wrong.

---

## Part 2: Redux Toolkit

### 10. The Store (app/store.js)
So, what's the store? It's basically the big boss of your app's state. It's the one place where all your important data lives. Super organized!

How to set it up:

```javascript
// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer, // This is where all your slices will go!
  },
});

// main.jsx
import { Provider } from 'react-redux';
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

### 11. createSlice (The Brains of Redux!)
And what does this do? Oh, this is the magic function! It neatly bundles up your state, reducers, and actions into one little "slice." Say goodbye to writing tons of boilerplate code!

Here's the magic:

```javascript
// features/counter/counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1; },
    decrement: (state) => { state.value -= 1; },
  },
});

export const { increment, decrement } = counterSlice.actions;
export default counterSlice.reducer;
```

### 12. useSelector (to Read State)
So, what's this for? It's a hook that lets your components peek into the Redux store and grab whatever data they need to display.

Like this:

```jsx
import { useSelector } from 'react-redux';

function CounterDisplay() {
  const count = useSelector((state) => state.counter.value);
  return <h1>Count: {count}</h1>;
}
```

### 13. useDispatch (to Change State)
And this one? This hook gives you the dispatch function, which is how you tell Redux, "Hey, I want to change something!" You just dispatch an action, and the state updates.

Here's how:

```jsx
import { useDispatch } from 'react-redux';
import { increment } from './counterSlice';

function CounterButtons() {
  const dispatch = useDispatch();
  return <button onClick={() => dispatch(increment())}>Go Up!</button>;
}
```

### 14. createAsyncThunk (for API Calls!)
What's this all about? This is your go-to for API calls in Redux! It's a special function that handles all the messy async stuff for you. It automatically gives you pending, fulfilled, and rejected states, so showing loading spinners and error messages is a piece of cake!

Here's the pattern:

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 1. You create the "thunk"
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get('/api/users');
  return response.data;
});

// 2. You handle its states in your slice
const usersSlice = createSlice({
  name: 'users',
  initialState: { users: [], status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state) => { state.status = 'failed'; });
  },
});
```