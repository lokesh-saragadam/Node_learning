import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from 'react-error-boundary';

// App.jsx
import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Login/Login.jsx"
import DashBoard from "./pages/DashBoard/DashBoard.jsx";
import Register from "./pages/Register/Register.jsx";
import ProfilePage from "./pages/Profile/ProfilePage.jsx";

function ErrorFallback({ error }) {
  return (
    <div style={{ color: 'red', padding: '20px' }}>
      <h2>Something went wrong in this component:</h2>
      <pre>{error.message}</pre>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Routes>
        <Route path="/" 
        element = {
          <Home/>
        }
        />
        <Route path="/login" 
        element = {
          <Login />
        }
        />
        <Route path="/register" element={
              <Register />
          } />
        <Route path="/onboarding/:id" element={
          <div className="home-page">
            <ProfilePage />
          </div>
        } /> 
        <Route path="/dashboard/:id" element={
          <div className="home-page">
            <DashBoard/>
          </div>
        } />
        </Routes>
      </ErrorBoundary>
  );
}
