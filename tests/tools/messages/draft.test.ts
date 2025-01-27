import { handleDraftEmail } from '../../../src/tools/messages/draft.js';
import { draftEmail } from '../../../src/services/gmail/drafts.js';

// Mock the service layer
jest.mock('../../../src/services/gmail/drafts.js');

describe('Draft Email Tool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a draft email successfully', async () => {
    const mockArgs = {
      to: ['test@example.com'],
      subject: 'Test Subject',
      body: 'Test Body'
    };

    const mockResponse = {
      content: [{
        type: "text",
        text: "Draft created successfully. Draft ID: draft123"
      }]
    };
    
    (draftEmail as jest.Mock).mockResolvedValue(mockResponse);

    const result = await handleDraftEmail(mockArgs);
    
    expect(draftEmail).toHaveBeenCalledWith(mockArgs);
    expect(result).toEqual(mockResponse);
  });

  it('creates a draft with optional parameters', async () => {
    const mockArgs = {
      to: ['test@example.com'],
      cc: ['cc@example.com'],
      bcc: ['bcc@example.com'],
      subject: 'Test Subject',
      body: 'Test Body',
      isHtml: true
    };

    const mockResponse = {
      content: [{
        type: "text",
        text: "Draft created successfully. Draft ID: draft123"
      }]
    };
    
    (draftEmail as jest.Mock).mockResolvedValue(mockResponse);

    const result = await handleDraftEmail(mockArgs);
    
    expect(draftEmail).toHaveBeenCalledWith(mockArgs);
    expect(result).toEqual(mockResponse);
  });

  it('throws error when required parameters are missing', async () => {
    const invalidArgs = {
      subject: 'Test Subject',
      body: 'Test Body'
    };

    await expect(handleDraftEmail(invalidArgs))
      .rejects
      .toThrow('Invalid draft email arguments. Required: to (array), subject (string), body (string)');
    
    expect(draftEmail).not.toHaveBeenCalled();
  });

  it('throws error when parameters are of wrong type', async () => {
    const invalidArgs = {
      to: 'not-an-array@example.com', // should be an array
      subject: 'Test Subject',
      body: 'Test Body'
    };

    await expect(handleDraftEmail(invalidArgs))
      .rejects
      .toThrow('Invalid draft email arguments. Required: to (array), subject (string), body (string)');
    
    expect(draftEmail).not.toHaveBeenCalled();
  });

  it('handles service errors', async () => {
    const mockArgs = {
      to: ['test@example.com'],
      subject: 'Test Subject',
      body: 'Test Body'
    };

    const error = new Error('Service error');
    (draftEmail as jest.Mock).mockRejectedValue(error);

    await expect(handleDraftEmail(mockArgs))
      .rejects
      .toThrow('Service error');
  });
});