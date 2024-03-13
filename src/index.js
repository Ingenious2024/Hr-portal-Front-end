// index.js
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from "./App";
import { AuthProvider } from "./Routes/AuthContext"; // Adjust the import path as necessary
import LoginPage from './components/LoginPage';

ReactDOM.render(
  <Router>
    <AuthProvider>
    <Routes>
    <Route path="/login" element={<LoginPage />} />
    </Routes>
      <App />
    </AuthProvider>
  </Router>,
  document.getElementById("root")
);
