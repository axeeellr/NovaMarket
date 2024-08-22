import React from 'react'
import ReactDOM from 'react-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'
import './css/root.css';

const clientId = '230090427927-qu0pihm7sc8p7pphkuk7tqogffm23icu.apps.googleusercontent.com';

ReactDOM.render(
  <GoogleOAuthProvider clientId={clientId}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GoogleOAuthProvider>,
  document.getElementById('root'),
)
