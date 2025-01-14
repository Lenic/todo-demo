import { createEffect, createSignal } from 'solid-js';
import './App.css';

function App() {
  const [count, setCount] = createSignal(0);

  createEffect(() => {});

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <div class="logo solid">Vite Logo</div>
        </a>
        <a href="https://solidjs.com" target="_blank">
          <div class="logo solid">Solid Logo</div>
        </a>
      </div>
      <h1>Vite + Solid</h1>
      <div class="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count()}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p class="read-the-docs">Click on the Vite and Solid logos to learn more</p>
    </>
  );
}

export default App;
