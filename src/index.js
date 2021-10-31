import React from "react";
import { render } from "react-dom";
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import "./index.css";
import App from "./app";
import reducer from './store/reducer';
import reportWebVitals from "./reportWebVitals";

const store = createStore(reducer)

render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
