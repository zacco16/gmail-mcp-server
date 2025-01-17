import express from 'express';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import GmailAuth from './auth.js';

// Load environment variables
dotenv.config();

const requiredEnvVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'REDIRECT_URI',
  'GOOGLE_REFRESH_TOKEN'
];

// Verify all required environment variables are present
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

const app = express();
const port = 4100;

// Gmail API scopes
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.modify'
];

// Initialize auth client
const auth = new GmailAuth({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
  refreshToken: process.env.GOOGLE_REFRESH_TOKEN
});

// Initialize Gmail API
const gmail = google.gmail({ version: 'v1', auth: await auth.getAuthorizedClient() });

app.get('/auth', (req, res) => {
  const authUrl = auth.generateAuthUrl(SCOPES);
  res.redirect(authUrl);
});

app.get('/code', async (req, res) => {
  try {
    const { code } = req.query;
    const tokens = await auth.getTokenFromCode(code);
    console.log('Refresh Token:', tokens.refresh_token);
    res.send('Authentication successful! Check your console for the refresh token.');
  } catch (error) {
    console.error('Error in auth callback:', error);
    res.status(500).send('Authentication failed');
  }
});

// Test endpoint to verify Gmail API access
app.get('/test', async (req, res) => {
  try {
    const response = await gmail.users.getProfile({ userId: 'me' });
    res.json(response.data);
  } catch (error) {
    console.error('Error testing Gmail API:', error);
    res.status(500).json({ error: 'Failed to access Gmail API' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});