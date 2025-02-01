import { jest } from '@jest/globals';
import { handleSendChatMessage } from '../../../src/tools/chat/send';
import * as chatService from '../../../src/services/chat/messages';
import { mockSendMessageResponse } from '../../utils/chat-mocks';
import { ChatResponse } from '../../../src/types/chat';

// Mock the chat service with proper typing
jest.mock('../../../src/services/chat/messages');

describe('Send Chat Message Tool', () => {
  const mockSuccessResponse: ChatResponse = {
    content: [{ 
      type: 'text',
      text: 'Message sent successfully'
    }]
  };

  beforeEach(() => {
    jest.resetAllMocks();
    // Use proper typing for the mock
    (chatService.sendMessage as jest.MockedFunction<typeof chatService.sendMessage>)
      .mockResolvedValue(mockSuccessResponse);
  });

  it('sends message successfully', async () => {
    const params = {
      space: 'spaces/123',
      text: 'Test message'
    };
    
    const result = await handleSendChatMessage(params);
    
    expect(chatService.sendMessage).toHaveBeenCalledWith(params);
    expect(result).toEqual(mockSuccessResponse);
  });

  it('sends message with thread', async () => {
    const params = {
      space: 'spaces/123',
      text: 'Test reply',
      threadKey: 'thread123'
    };
    
    const result = await handleSendChatMessage(params);
    
    expect(chatService.sendMessage).toHaveBeenCalledWith(params);
    expect(result).toEqual(mockSuccessResponse);
  });

  it('validates required parameters', async () => {
    // Test missing space
    const result1 = await handleSendChatMessage({ text: 'Test' });
    expect(result1.isError).toBe(true);
    expect(result1.content[0].text).toContain('space parameter is required');
    
    // Test missing text
    const result2 = await handleSendChatMessage({ space: 'spaces/123' });
    expect(result2.isError).toBe(true);
    expect(result2.content[0].text).toContain('text parameter is required');
    
    expect(chatService.sendMessage).not.toHaveBeenCalled();
  });

  it('handles service errors', async () => {
    const error = new Error('Service error');
    // Fix the typing for mockRejectedValue
    jest.spyOn(chatService, 'sendMessage')
      .mockRejectedValueOnce(error);

    const result = await handleSendChatMessage({ 
      space: 'spaces/123',
      text: 'Test message'
    });
    
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Service error');
  });
});