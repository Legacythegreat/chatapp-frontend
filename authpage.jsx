import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Paper, Box } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import io from 'socket.io-client';

const AuthPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const { setUser } = useContext(AuthContext);
  const { setSocket } = useContext(SocketContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // In a real app, this would call your backend API
    const mockUser = {
      id: 'user_' + Math.random().toString(36).substring(2, 9),
      username,
      token: 'mock_jwt_token_' + username
    };
    
    // Set up socket connection
    const socket = io('http://localhost:3000', {
      auth: { token: mockUser.token }
    });
    
    setSocket(socket);
    setUser(mockUser);
    navigate('/chat');
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Paper elevation={3} sx={{ p: 4, width: 300 }}>
        <Typography variant="h5" gutterBottom>
          {isLogin ? 'Login' : 'Register'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            {isLogin ? 'Login' : 'Register'}
          </Button>
        </form>
        <Button
          onClick={() => setIsLogin(!isLogin)}
          sx={{ mt: 2 }}
          fullWidth
        >
          {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
        </Button>
      </Paper>
    </Box>
  );
};

export default AuthPage;s