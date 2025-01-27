import { handleListMessages } from '../../../src/tools/messages/list.js';
import { listMessages } from '../../../src/services/gmail/messages.js';
import { DEFAULTS } from '../../../src/config/constants.js';

// Mock the service layer
jest.mock('../../../src/services/gmail/messages.js');

describe('List Messages Tool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles basic list request', async () => {
    const mockResponse = {
      content: [{
        type: "text",
        text: "1. Message ID: msg123"
      }]
    };
    
    (listMessages as jest.Mock).mockResolvedValue(mockResponse);

    const result = await handleListMessages({});
    
    expect(listMessages).toHaveBeenCalledWith({});
    expect(result).toEqual(mockResponse);
  });

  it('passes through query parameters', async () => {
    const args = {
      query: "important",
      maxResults: 5,
      unreadOnly: true
    };

    const mockResponse = {
      content: [{
        type: "text",
        text: "1. Message ID: msg123"
      }]
    };
    (listMessages as jest.Mock).mockResolvedValue(mockResponse);

    await handleListMessages(args);
    
    expect(listMessages).toHaveBeenCalledWith(expect.objectContaining(args));
  });

  it('handles service errors', async () => {
    const error = new Error('Service error');
    (listMessages as jest.Mock).mockRejectedValue(error);

    await expect(handleListMessages({})).rejects.toThrow('Service error');
  });
});