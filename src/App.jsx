// import { useState } from 'react'

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Client from "./Client";
import Admin from "./Admin";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  const ggClientId = import.meta.env.VITE_GG_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={ggClientId}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Client />} />
          <Route path="/admin" element={<Admin />} />
          {/* Add more routes here */}
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
