import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = "506207457326-a457gop4rg41d04n6cep7qd05ulfsvnm.apps.googleusercontent.com";


createRoot(document.getElementById('root')).render(
    // <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <App />
  // </GoogleOAuthProvider>
)
