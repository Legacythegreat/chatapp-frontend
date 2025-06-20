import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import AuthPage from './components/AuthPage';
import ChatPage from './components/ChatPage';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AuthProvider>
        <SocketProvider>
          <Router>
            <Box sx={{ height: '100vh' }}>
              <Routes>
                <Route path="/" element={<AuthPage />} />
                <Route path="/chat" element={<ChatPage />} />
              </Routes>
            </Box>
          </Router>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;