import { OAuth2Client, Credentials } from 'google-auth-library';
import { EventEmitter } from 'events';

export class AuthManager extends EventEmitter {
  private client: OAuth2Client;
  private refreshInterval: NodeJS.Timeout | null = null;
  private credentials: Credentials | null = null;
  private isRefreshing = false;

  constructor(
    clientId: string,
    clientSecret: string,
    redirectUri: string,
    refreshToken?: string
  ) {
    super();
    
    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error('Missing required OAuth2 credentials');
    }

    this.client = new OAuth2Client({
      clientId,
      clientSecret,
      redirectUri,
      forceRefreshOnFailure: true
    });
    
    if (refreshToken) {
      this.client.setCredentials({ refresh_token: refreshToken });
      // Don't await here - we'll handle the refresh cycle asynchronously
      this.startRefreshCycle();
    }

    this.client.on('tokens', (tokens) => {
      if (tokens.refresh_token) {
        this.credentials = tokens;
      } else if (this.credentials?.refresh_token) {
        // Preserve the refresh token if we already have one
        this.credentials = {
          ...tokens,
          refresh_token: this.credentials.refresh_token
        };
      }
      this.emit('tokens', this.credentials);
    });
  }

  private async startRefreshCycle() {
    if (this.isRefreshing) return;
    
    try {
      this.isRefreshing = true;
      
      // Clear any existing refresh interval
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
        this.refreshInterval = null;
      }

      // Get fresh tokens
      const { credentials } = await this.client.getAccessToken();
      this.credentials = credentials;

      // Calculate next refresh time (5 mins before expiry)
      const expiryDate = credentials.expiry_date;
      if (expiryDate) {
        const refreshMs = Math.max(0, (expiryDate - Date.now()) - (5 * 60 * 1000));
        
        // Schedule next refresh
        this.refreshInterval = setTimeout(() => {
          this.startRefreshCycle().catch(console.error);
        }, refreshMs);
      }
    } catch (error) {
      console.error('Error in refresh cycle:', error);
      // Retry in 30 seconds on failure
      this.refreshInterval = setTimeout(() => {
        this.startRefreshCycle().catch(console.error);
      }, 30000);
    } finally {
      this.isRefreshing = false;
    }
  }

  public async getClient(): Promise<OAuth2Client> {
    if (!this.credentials?.access_token) {
      await this.startRefreshCycle();
    }
    return this.client;
  }

  public async validateAuth(): Promise<boolean> {
    try {
      const client = await this.getClient();
      // Test the credentials with a basic API call
      await client.getTokenInfo(this.credentials?.access_token || '');
      return true;
    } catch (error) {
      console.error('Auth validation failed:', error);
      return false;
    }
  }

  public destroy() {
    if (this.refreshInterval) {
      clearTimeout(this.refreshInterval);
      this.refreshInterval = null;
    }
    this.removeAllListeners();
  }
}