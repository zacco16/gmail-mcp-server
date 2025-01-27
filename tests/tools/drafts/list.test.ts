import { jest } from '@jest/globals';
import { handleListDrafts, LIST_DRAFTS_TOOL } from '../../../src/tools/drafts/list';
import * as draftsService from '../../../src/services/gmail/drafts';
import { DEFAULTS } from '../../../src/config/constants';

// Mock the drafts service
jest.mock('../../../src/services/gmail/drafts');

describe('List Drafts Tool', () => {
  // Mock response for drafts
  const mockDraftsResponse = {
    content: [
      { type: 'text', text: 'Draft 1' },
      { type: 'text', text: 'Draft 2' }
    ]
  };

  beforeEach(() => {
    jest.resetAllMocks();
    (draftsService.listDrafts as jest.MockedFunction<typeof draftsService.listDrafts>)
      .mockResolvedValue(mockDraftsResponse);
  });

  it('tool metadata is correctly defined', () => {
    expect(LIST_DRAFTS_TOOL.name).toBe('listDrafts');
    expect(LIST_DRAFTS_TOOL.description).toBe('List Gmail draft messages');
    
    // Verify input schema structure
    expect(LIST_DRAFTS_TOOL.inputSchema.type).toBe('object');
    expect(LIST_DRAFTS_TOOL.inputSchema.properties).toHaveProperty('maxResults');
    expect(LIST_DRAFTS_TOOL.inputSchema.properties).toHaveProperty('query');
    expect(LIST_DRAFTS_TOOL.inputSchema.properties).toHaveProperty('verbose');
  });

  it('returns drafts with default parameters', async () => {
    const result = await handleListDrafts();
    
    expect(draftsService.listDrafts).toHaveBeenCalledWith({ 
      maxResults: DEFAULTS.LIST_MAX_RESULTS 
    });
    expect(result).toEqual(mockDraftsResponse);
  });

  it('passes custom parameters to service', async () => {
    const params = {
      maxResults: 20,
      query: 'test drafts',
      verbose: true
    };
    
    const result = await handleListDrafts(params);
    
    expect(draftsService.listDrafts).toHaveBeenCalledWith(params);
    expect(result).toEqual(mockDraftsResponse);
  });

  it('handles service errors', async () => {
    const error = new Error('List drafts failed');
    (draftsService.listDrafts as jest.MockedFunction<typeof draftsService.listDrafts>)
      .mockRejectedValue(error);
    
    await expect(handleListDrafts()).rejects.toThrow('List drafts failed');
  });

  it('uses default max results when no arguments passed', async () => {
    await handleListDrafts();
    
    expect(draftsService.listDrafts).toHaveBeenCalledWith({ 
      maxResults: DEFAULTS.LIST_MAX_RESULTS 
    });
  });
});