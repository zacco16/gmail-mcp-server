import { handleReadMessage } from '../../../src/tools/messages/read.js';
import { readMessage } from '../../../src/services/gmail/messages.js';

// Mock the service layer
jest.mock('../../../src/services/gmail/messages.js');

describe('Read Message Tool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('reads a message successfully', async () => {
    const mockResponse = {
      content: [{
        type: "text",
        text: "From: test@example.com\nSubject: Test Email\n\nEmail content"
      }]
    };
    
    (readMessage as jest.Mock).mockResolvedValue(mockResponse);

    const result = await handleReadMessage({ messageId: 'msg123' });
    
    expect(readMessage).toHaveBeenCalledWith({ messageId: 'msg123' });
    expect(result).toEqual(mockResponse);
  });

  it('throws error when messageId is missing', async () => {
    await expect(handleReadMessage({}))
      .rejects
      .toThrow('messageId is required and must be a string');
    
    expect(readMessage).not.toHaveBeenCalled();
  });

  it('throws error when messageId is not a string', async () => {
    await expect(handleReadMessage({ messageId: 123 }))
      .rejects
      .toThrow('messageId is required and must be a string');
    
    expect(readMessage).not.toHaveBeenCalled();
  });

  it('handles service errors', async () => {
    const error = new Error('Service error');
    (readMessage as jest.Mock).mockRejectedValue(error);

    await expect(handleReadMessage({ messageId: 'msg123' }))
      .rejects
      .toThrow('Service error');
  });
});