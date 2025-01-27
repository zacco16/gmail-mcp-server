export const mockListMessagesResponse = {
  data: {
    messages: [
      { id: 'msg1', threadId: 'thread1' },
      { id: 'msg2', threadId: 'thread2' }
    ]
  }
};

export const mockReadMessageResponse = {
  data: {
    id: 'msg1',
    threadId: 'thread1',
    snippet: 'Message preview...',
    payload: {
      headers: [
        { name: 'Subject', value: 'Test Subject' },
        { name: 'From', value: 'sender@example.com' }
      ],
      body: {
        data: Buffer.from('Message content').toString('base64')
      }
    }
  }
};

export const mockDraftResponse = {
  data: {
    id: 'draft1',
    message: {
      id: 'msg1',
      threadId: 'thread1'
    }
  }
};

export const mockError = {
  code: 400,
  message: 'Bad Request',
  errors: [
    {
      message: 'Invalid message format',
      domain: 'global',
      reason: 'invalidArgument'
    }
  ]
};