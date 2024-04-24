// App.jsx o index.js
import React from 'react';
import { UserProvider } from './UserContext';
import AppRouter from './Router.jsx';

const App = () => {
  return (
    <UserProvider>
      <AppRouter/>
    </UserProvider>
  );
}

export default App;
