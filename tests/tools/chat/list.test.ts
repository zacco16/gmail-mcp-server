import { jest } from '@jest/globals';
import { handleListChatMessages } from '../../../src/tools/chat/list';
import * as chatService from '../../../src/services/chat/messages';
import { mockListMessagesResponse } from '../../utils/chat-mocks';
import { ChatResponse } from '../../../src/types/chat';

// Mock the chat service with proper typing
jest.mock('../../../src/services/chat/messages');

describe('List Chat Messages Tool', () => {
  const mockSuccessResponse: ChatResponse = {
    content: [{ 
      type: 'text',
      text: 'Mock message content'
    }]
  };

  beforeEach(() => {
    jest.resetAllMocks();
    // Use proper typing for the mock
    (chatService.listMessages as jest.MockedFunction<typeof chatService.listMessages>)
      .mockResolvedValue(mockSuccessResponse);
  });

  it('returns messages with default parameters', async () => {
    const space = 'spaces/123';
    const result = await handleListChatMessages({ space });
    
    expect(chatService.listMessages).toHaveBeenCalledWith({
      space,
      maxResults: 10
    });
    expect(result).toEqual(mockSuccessResponse);
  });

  it('handles custom parameters correctly', async () => {
    const params = {
      space: 'spaces/123',
      maxResults: 5,
      filter: 'test query',
      pageToken: 'next-page'
    };
    
    const result = await handleListChatMessages(params);
    
    expect(chatService.listMessages).toHaveBeenCalledWith(params);
    expect(result).toEqual(mockSuccessResponse);
  });

  it('validates space parameter', async () => {
    const result = await handleListChatMessages({});
    
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('space parameter is required');
    expect(chatService.listMessages).not.toHaveBeenCalled();
  });

  it('handles service errors', async () => {
    const error = new Error('Service error');
    // Fix the typing for mockRejectedValue
    jest.spyOn(chatService, 'listMessages')
      .mockRejectedValueOnce(error);

    const result = await handleListChatMessages({ space: 'spaces/123' });
    
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Service error');
  });
});