import { jest } from '@jest/globals';
import { handleReadDraft, READ_DRAFT_TOOL } from '../../../src/tools/drafts/read';
import * as draftsService from '../../../src/services/gmail/drafts';

// Mock the drafts service
jest.mock('../../../src/services/gmail/drafts');

describe('Read Draft Tool', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('tool metadata is correctly defined', () => {
    expect(READ_DRAFT_TOOL.name).toBe('readDraft');
    expect(READ_DRAFT_TOOL.description).toBe('Get detailed information about a Gmail draft message');
    
    // Verify input schema structure
    expect(READ_DRAFT_TOOL.inputSchema.type).toBe('object');
    expect(READ_DRAFT_TOOL.inputSchema.properties).toHaveProperty('draftId');
    expect(READ_DRAFT_TOOL.inputSchema.required).toContain('draftId');
  });

  it('returns draft details with valid draftId', async () => {
    const mockDraftResponse = {
      content: [
        { type: 'text', text: 'Draft Details' }
      ]
    };
    (draftsService.readDraft as jest.MockedFunction<typeof draftsService.readDraft>)
      .mockResolvedValue(mockDraftResponse);

    const params = { draftId: 'draft123' };
    const result = await handleReadDraft(params);
    
    expect(draftsService.readDraft).toHaveBeenCalledWith({
      draftId: 'draft123'
    });
    expect(result).toEqual(mockDraftResponse);
  });

  it('handles service errors', async () => {
    const error = new Error('Read draft failed');
    (draftsService.readDraft as jest.MockedFunction<typeof draftsService.readDraft>)
      .mockRejectedValue(error);
    
    const result = await handleReadDraft({ draftId: 'draft123' });
    
    expect(result).toEqual({
      content: [{ 
        type: 'text', 
        text: expect.stringContaining('Error reading draft: Read draft failed')
      }],
      isError: true
    });
  });

  it('handles missing draftId', async () => {
    const result = await handleReadDraft({});
    
    expect(result).toEqual({
      content: [{ 
        type: 'text', 
        text: expect.stringContaining('Error reading draft: Invalid or missing draft ID')
      }],
      isError: true
    });
  });
});