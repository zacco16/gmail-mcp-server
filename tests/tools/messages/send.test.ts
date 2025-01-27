import { handleSendEmail } from '../../../src/tools/messages/send.js';
import { sendEmail } from '../../../src/services/gmail/send.js';

// Mock the service layer
jest.mock('../../../src/services/gmail/send.js');

describe('Send Email Tool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sends an email successfully with required parameters', async () => {
    const mockArgs = {
      to: ['test@example.com'],
      subject: 'Test Subject',
      body: 'Test Body'
    };

    const mockResponse = {
      content: [{
        type: "text",
        text: "Email sent successfully. Message ID: msg123"
      }]
    };
    
    (sendEmail as jest.Mock).mockResolvedValue(mockResponse);

    const result = await handleSendEmail(mockArgs);
    
    expect(sendEmail).toHaveBeenCalledWith(mockArgs);
    expect(result).toEqual(mockResponse);
  });

  it('sends an email with all optional parameters', async () => {
    const mockArgs = {
      to: ['test@example.com'],
      cc: ['cc@example.com'],
      bcc: ['bcc@example.com'],
      subject: 'Test Subject',
      body: 'Test Body',
      isHtml: true,
      draftId: 'draft123'
    };

    const mockResponse = {
      content: [{
        type: "text",
        text: "Email sent successfully. Message ID: msg123"
      }]
    };
    
    (sendEmail as jest.Mock).mockResolvedValue(mockResponse);

    const result = await handleSendEmail(mockArgs);
    
    expect(sendEmail).toHaveBeenCalledWith(mockArgs);
    expect(result).toEqual(mockResponse);
  });

  it('throws error when required parameters are missing', async () => {
    const invalidArgs = {
      subject: 'Test Subject',
      body: 'Test Body'
    };

    await expect(handleSendEmail(invalidArgs))
      .rejects
      .toThrow('Invalid send email arguments. Required: to (array), subject (string), body (string)');
    
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('throws error when parameters are of wrong type', async () => {
    const invalidArgs = {
      to: 'not-an-array@example.com', // should be an array
      subject: 'Test Subject',
      body: 'Test Body'
    };

    await expect(handleSendEmail(invalidArgs))
      .rejects
      .toThrow('Invalid send email arguments. Required: to (array), subject (string), body (string)');
    
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('handles service errors', async () => {
    const mockArgs = {
      to: ['test@example.com'],
      subject: 'Test Subject',
      body: 'Test Body'
    };

    const error = new Error('Service error');
    (sendEmail as jest.Mock).mockRejectedValue(error);

    await expect(handleSendEmail(mockArgs))
      .rejects
      .toThrow('Service error');
  });
});