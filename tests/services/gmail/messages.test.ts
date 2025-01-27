import { listMessages } from '../../../src/services/gmail/messages.js';
import { gmail } from '../../../src/config/auth.js';
import { mockListMessagesResponse } from '../../utils/gmail-mocks.js';

// Mock Gmail API
jest.mock('../../../src/config/auth.js', () => ({
  gmail: {
    users: {
      messages: {
        list: jest.fn()
      }
    }
  }
}));

describe('Gmail Service - Messages', () => {
  // Store original console.error
  const originalConsoleError = console.error;
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Silence console.error for clean test output
    console.error = jest.fn();
  });

  afterEach(() => {
    // Restore console.error after each test
    console.error = originalConsoleError;
  });

  afterAll(() => {
    // Extra safety to ensure console.error is restored
    console.error = originalConsoleError;
  });

  describe('listMessages', () => {
    it('returns formatted messages', async () => {
      (gmail.users.messages.list as jest.Mock).mockResolvedValue(mockListMessagesResponse);

      const result = await listMessages({});
      expect(result.content[0].text).toContain('msg1');
    });

    it('handles empty response', async () => {
      (gmail.users.messages.list as jest.Mock).mockResolvedValue({ data: { messages: [] } });

      const result = await listMessages({});
      expect(result.content[0].text).toBe('');
    });

    it('handles API errors', async () => {
      const error = new Error('API Error');
      (gmail.users.messages.list as jest.Mock).mockRejectedValue(error);

      await expect(listMessages({})).rejects.toThrow('API Error');
      
      // Verify error was logged (optional)
      expect(console.error).toHaveBeenCalledWith('List messages error:', error);
    });
  });
});