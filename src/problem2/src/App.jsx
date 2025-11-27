import "./App.css";
import SwapForm from "./components/SwapForm";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="min-h-screen from-blue-50 to-indigo-100 py-8 px-4">
      <SwapForm />
      <ToastContainer />
    </div>
  );
}

export default App;
