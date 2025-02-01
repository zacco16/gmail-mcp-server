import express from 'express';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

// Add debugging
console.log('Environment variables loaded:', {
  clientId: process.env.GOOGLE_CLIENT_ID ? 'Present' : 'Missing',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'Present' : 'Missing',
  redirectUri: process.env.REDIRECT_URI ? 'Present' : 'Missing',
  refreshToken: process.env.GOOGLE_REFRESH_TOKEN ? 'Present' : 'Missing'
});

const app = express();
const port = 4100;

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// API scopes for Gmail, Calendar and Chat
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/chat.messages'
];

app.get('/auth', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'select_account consent',  // Changed this line to force both account selection and consent
    include_granted_scopes: true
  });
  res.redirect(authUrl);
});

app.get('/code', async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    console.log('Refresh Token:', tokens.refresh_token);
    res.send('Authentication successful! Check your console for the refresh token. You can now close this window.');
  } catch (error) {
    console.error('Error getting tokens:', error);
    res.status(500).send('Error getting tokens');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Visit http://localhost:${port}/auth to start the OAuth flow`);
});