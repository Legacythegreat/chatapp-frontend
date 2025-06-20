import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import AuthPage from './components/AuthPage';
import ChatPage from './components/ChatPage';
import { AuthContext } from './context/AuthContext';
import { SocketContext } from './context/SocketContext';
import { generateIdentityKeyPair } from './lib/crypto';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [identityKey, setIdentityKey] = useState(null);

  useEffect(() => {
    // Initialize crypto keys
    const initKeys = async () => {
      const keys = await generateIdentityKeyPair();
      setIdentityKey(keys);
    };
    
    initKeys();
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AuthContext.Provider value={{ user, setUser }}>
        <SocketContext.Provider value={{ socket, setSocket }}>
          <Box sx={{ height: '100vh' }}>
            <Router>
              <Routes>
                <Route path="/" element={user ? <Navigate to="/chat" /> : <AuthPage />} />
                <Route path="/chat" element={user ? <ChatPage identityKey={identityKey} /> : <Navigate to="/" />} />
              </Routes>
            </Router>
          </Box>
        </SocketContext.Provider>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;