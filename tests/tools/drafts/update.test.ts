import { handleUpdateDraft, UPDATE_DRAFT_TOOL } from '../../../src/tools/drafts/update';
import { updateDraft } from '../../../src/services/gmail/drafts';

// Mock the updateDraft service
jest.mock('../../../src/services/gmail/drafts');

describe('Update Draft Tool', () => {
  // Existing test code remains the same...

  // Error handling scenarios
  describe('Error Handling', () => {
    const mockDraftId = 'draft123';

    it('should handle draft not found error', async () => {
      // Suppress console error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      (updateDraft as jest.Mock).mockRejectedValue(new Error('Draft not found'));

      const result = await handleUpdateDraft({ draftId: mockDraftId });
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Error updating draft: Draft not found');

      // Restore console.error
      consoleErrorSpy.mockRestore();
    });

    it('should handle invalid recipient emails', async () => {
      // Suppress console error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      (updateDraft as jest.Mock).mockRejectedValue(new Error('Invalid email address'));

      const result = await handleUpdateDraft({ 
        draftId: mockDraftId, 
        to: ['invalid-email']
      });
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Error updating draft: Invalid email address');

      // Restore console.error
      consoleErrorSpy.mockRestore();
    });
  });

  // Rest of the test remains the same...
});
