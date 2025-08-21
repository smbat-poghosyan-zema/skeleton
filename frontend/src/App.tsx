import { useEffect, useState } from 'react';

function App() {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/health`)
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus('error'));
  }, []);

  return <div className="p-4">Backend status: {status}</div>;
}

export default App;
