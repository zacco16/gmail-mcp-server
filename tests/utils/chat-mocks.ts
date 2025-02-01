export const mockListMessagesResponse = {
  data: {
    messages: [
      {
        name: 'spaces/123/messages/456',
        sender: { displayName: 'Test User' },
        createTime: '2024-01-27T10:00:00Z',
        text: 'Test message 1'
      },
      {
        name: 'spaces/123/messages/457',
        sender: { displayName: 'Another User' },
        createTime: '2024-01-27T10:01:00Z',
        text: 'Test message 2'
      }
    ]
  }
};

export const mockSendMessageResponse = {
  data: {
    name: 'spaces/123/messages/789',
    createTime: '2024-01-27T10:02:00Z',
    text: 'Test message'
  }
};