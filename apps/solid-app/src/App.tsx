import { createSignal } from 'solid-js';

import { Button } from '@/components/ui/button';

function App() {
  const [count, setCount] = createSignal(0);

  return (
    <>
      <h1>Vite + Solid</h1>
      <div>
        <Button onClick={() => setCount((count) => count + 1)}>current count is {count()}</Button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </>
  );
}

export default App;
