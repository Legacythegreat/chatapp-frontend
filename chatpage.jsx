import React, { useState, useEffect, useContext } from 'react';
import { Box, List, ListItem, ListItemText, TextField, Button, Typography, Avatar, Paper, IconButton } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import { encryptMessage, decryptMessage, initializeSession } from '../lib/crypto';

const ChatPage = ({ identityKey }) => {
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([
    { id: 'user2', username: 'Alice' },
    { id: 'user3', username: 'Bob' }
  ]);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    if (!socket) return;

    socket.on('receive-message', async (data) => {
      try {
        const decrypted = await decryptMessage(data.encryptedMessage, data.sender);
        setMessages(prev => [...prev, {
          sender: data.sender,
          text: decrypted,
          timestamp: new Date()
        }]);
      } catch (err) {
        console.error('Decryption failed:', err);
      }
    });

    return () => {
      socket.off('receive-message');
    };
  }, [socket]);

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedContact) return;

    try {
      // Initialize session if not already done
      await initializeSession(selectedContact.id, identityKey);
      
      const encrypted = await encryptMessage(message, selectedContact.id);
      
      socket.emit('send-message', {
        recipient: selectedContact.id,
        encryptedMessage: encrypted
      });

      setMessages(prev => [...prev, {
        sender: user.id,
        text: message,
        timestamp: new Date()
      }]);

      setMessage('');
    } catch (err) {
      console.error('Encryption failed:', err);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      {/* Contacts sidebar */}
      <Box sx={{ width: 250, borderRight: '1px solid #444', p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Contacts</Typography>
        <List>
          {contacts.map(contact => (
            <ListItem 
              button 
              key={contact.id}
              selected={selectedContact?.id === contact.id}
              onClick={() => setSelectedContact(contact)}
            >
              <Avatar sx={{ mr: 2 }}>{contact.username.charAt(0)}</Avatar>
              <ListItemText primary={contact.username} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Chat area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedContact ? (
          <>
            <Box sx={{ p: 2, borderBottom: '1px solid #444' }}>
              <Typography variant="h6">{selectedContact.username}</Typography>
            </Box>
            
            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              {messages
                .filter(m => 
                  (m.sender === user.id && selectedContact.id === m.recipient) ||
                  (m.sender === selectedContact.id && m.recipient === user.id)
                )
                .map((msg, i) => (
                  <Box 
                    key={i} 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: msg.sender === user.id ? 'flex-end' : 'flex-start',
                      mb: 2
                    }}
                  >
                    <Paper 
                      sx={{ 
                        p: 1.5, 
                        maxWidth: '70%',
                        bgcolor: msg.sender === user.id ? 'primary.main' : 'background.paper'
                      }}
                    >
                      <Typography>{msg.text}</Typography>
                      <Typography variant="caption" sx={{ display: 'block', textAlign: 'right' }}>
                        {msg.timestamp.toLocaleTimeString()}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
            </Box>
            
            <Box sx={{ p: 2, borderTop: '1px solid #444' }}>
              <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
                <Box sx={{ display: 'flex' }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type a message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <IconButton 
                    type="submit" 
                    color="primary" 
                    disabled={!message.trim() || !selectedContact}
                  >
                    <SendIcon />
                  </IconButton>
                </Box>
              </form>
            </Box>
          </>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%' 
          }}>
            <Typography>Select a contact to start chatting</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChatPage;