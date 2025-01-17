import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { OAuth2Client } from 'google-auth-library';

export interface ServiceContext {
  server: Server;
  auth: OAuth2Client;
}