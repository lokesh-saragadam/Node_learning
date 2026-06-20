import { Routes, Route } from "react-router-dom";
// App.jsx
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Stats from "./components/Stats.jsx";
import Features from "./components/Features.jsx";
import Login from "./components/Login.jsx"

import "./css/HomePage.css";


export default function App() {
  return (
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
    </Routes>
  );
}
