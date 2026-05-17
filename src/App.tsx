import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div className="hero">
          <img
            src={heroImg}
            className="base"
            width="170"
            height="179"
            alt="SenJr hero illustration"
          />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>SenJr: Mentor/Student Matching</h1>
          <p>
            Project is currently migrating to <strong>Next.js + Supabase</strong>.
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <h2>Project Roadmap</h2>
          <p>Key areas currently being audited and implemented:</p>
          <ul>
            <li>Supabase Auth Integration (PKCE)</li>
            <li>Row Level Security (RLS) Policies</li>
            <li>Mentor/Student Booking System</li>
          </ul>
        </div>
        <div id="social">
          <h2>Technical Stack</h2>
          <ul>
            <li>React 19 + TypeScript</li>
            <li>Next.js (App Router)</li>
            <li>Supabase (Postgres)</li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
