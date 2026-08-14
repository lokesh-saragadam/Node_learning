import react from "react";
import Header from "../../components/Headers/Header.jsx";
import Hero from "./Components/Hero.jsx";
import Stats from "./Components/Stats.jsx";
import Features from "./Components/Features.jsx";
import "./HomePage.css";

export default function Home(){
    return (
        <div className="home-page">
            <Header />
            <main>
              <Hero />
              <Stats />
              <Features />
            </main>
          </div>
    )
}