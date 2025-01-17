import { google } from 'googleapis';

class GmailAuth {
  constructor(config) {
    if (!config.clientId || !config.clientSecret || !config.redirectUri) {
      throw new Error('Missing required OAuth2 credentials');
    }

    this.oauth2Client = new google.auth.OAuth2(
      config.clientId,
      config.clientSecret,
      config.redirectUri
    );

    if (config.refreshToken) {
      this.oauth2Client.setCredentials({
        refresh_token: config.refreshToken
      });
    }
  }

  async getAuthorizedClient() {
    try {
      // Ensure we have a valid access token
      const credentials = await this.oauth2Client.getAccessToken();
      if (!credentials) {
        throw new Error('Failed to get access token');
      }
      return this.oauth2Client;
    } catch (error) {
      console.error('Error getting authorized client:', error);
      // Attempt to refresh the token
      try {
        await this.oauth2Client.refreshAccessToken();
        return this.oauth2Client;
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        throw new Error('Authentication failed');
      }
    }
  }

  generateAuthUrl(scopes) {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
  }

  async getTokenFromCode(code) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);
      return tokens;
    } catch (error) {
      console.error('Error getting tokens:', error);
      throw error;
    }
  }
}

export default GmailAuth;