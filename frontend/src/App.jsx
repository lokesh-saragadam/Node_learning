import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from 'react-error-boundary';

// App.jsx
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Stats from "./components/Stats.jsx";
import Features from "./components/Features.jsx";
import Login from "./components/Login.jsx"
import DashBoard from "./pages/DashBoard.jsx";
import Register from "./components/Register";
import ProfilePage from "./pages/ProfilePage.jsx";
import "./css/HomePage.css";

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
          <div className="home-page">
            <Header />
            <main>
              <Hero />
              <Stats />
              <Features />
            </main>
          </div>
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
