import React from 'react';
import { useRoutes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../src/store/store'; // Import your Redux store
import Themeroutes from './routes/Router';

const App = () => {
  const routing = useRoutes(Themeroutes);

  return (
    <Provider store={store}>
      <div className="dark">{routing}</div>
    </Provider>
  );
};

export default App;