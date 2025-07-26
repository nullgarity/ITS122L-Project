import React from 'react';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import routes from './routes';

function AppRoutes() {
  const element = useRoutes(routes);
  return element ?? null;
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;