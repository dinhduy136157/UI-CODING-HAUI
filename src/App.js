import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserRoutes from "./routes/UserRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import "./index.css"; // Tailwind CSS

function App() {
  return (
    <Router>
      <Routes>
        {/* Route cho User */}
        <Route path="/*" element={<UserRoutes />} />

        {/* Route cho Admin */}
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;