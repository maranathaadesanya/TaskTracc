import { Route, Routes } from "react-router-dom";
import { Login, Signup, Home } from "./pages";
import { Todolist } from "../src/";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/todolist" element={<Todolist />} />
      </Routes>
    </div>
  );
}

export default App;