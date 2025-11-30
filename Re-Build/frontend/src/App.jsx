import CreateTaskForm from "./components/CreateTaskForm";
import LoginPage from "./components/LoginPage";
import TaskList from "./components/TaskList";
import UserProfile from "./components/UserProfile";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<UserProfile />} />
        <Route path="/task/create" element={<CreateTaskForm />} />
        <Route path="/task" element={<TaskList />} />
      </Routes>
    </>
  );
}

export default App;
