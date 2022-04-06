import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import store from './redux/store';
import "./style/main.scss";

const container = document.getElementById('root');

if(container){
  const root = createRoot(container);
  root.render(
    <Provider store={store}>
      <App></App>
    </Provider>     
  )
}
