import React, { useState, useEffect } from 'react';
import { UserProvider } from './UserContext';
import AppRouter from './Router.jsx';
import LoadingScreen from './components/LoadingScreen'; // Asegúrate de que la ruta sea correcta

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => setLoading(false);
    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, []);

  return (
    <UserProvider>
      {loading ? <LoadingScreen /> : <AppRouter />}
    </UserProvider>
  );
}

export default App;
