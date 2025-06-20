import libsignal from 'libsignal-protocol';

// Mock storage for Signal Protocol (in a real app, use secure storage)
const storage = {
  identityKey: null,
  sessions: {},
  preKeys: {},
  signedPreKey: null,
};

// Initialize user's identity key
export async function generateIdentityKeyPair() {
  const identityKeyPair = await libsignal.KeyHelper.generateIdentityKeyPair();
  storage.identityKey = identityKeyPair;
  return identityKeyPair;
}

// Initialize session with a contact
export async function initializeSession(contactId, identityKey) {
  if (storage.sessions[contactId]) return; // Session already exists
  
  // Generate pre-keys for new session
  const preKey = await libsignal.KeyHelper.generatePreKey(1);
  const signedPreKey = await libsignal.KeyHelper.generateSignedPreKey(identityKey, 1);
  
  storage.preKeys[contactId] = preKey;
  storage.signedPreKey = signedPreKey;
  
  // In a real app, you would send these to the server for the contact to fetch
}

// Encrypt a message for a recipient
export async function encryptMessage(message, recipientId) {
  if (!storage.sessions[recipientId]) {
    throw new Error('No session established with this contact');
  }
  
  const sessionCipher = new libsignal.SessionCipher(storage, recipientId);
  const encrypted = await sessionCipher.encrypt(message);
  return encrypted;
}

// Decrypt a message from a sender
export async function decryptMessage(encryptedMessage, senderId) {
  if (!storage.sessions[senderId]) {
    throw new Error('No session established with this contact');
  }
  
  const sessionCipher = new libsignal.SessionCipher(storage, senderId);
  const decrypted = await sessionCipher.decrypt(encryptedMessage);
  return decrypted;
}