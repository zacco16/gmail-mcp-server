import { handleDeleteDraft, DELETE_DRAFT_TOOL } from '../../../src/tools/drafts/delete';
import { deleteDraft } from '../../../src/services/gmail/drafts';

// Mock the deleteDraft service
jest.mock('../../../src/services/gmail/drafts');

describe('Delete Draft Tool', () => {
  // Existing test code remains the same...

  // Error handling scenarios
  describe('Error Handling', () => {
    const mockDraftId = 'draft123';

    it('should handle draft not found error', async () => {
      // Suppress console error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      (deleteDraft as jest.Mock).mockRejectedValue(new Error('Draft not found'));

      const result = await handleDeleteDraft({ draftId: mockDraftId });
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Error deleting draft: Draft not found');

      // Restore console.error
      consoleErrorSpy.mockRestore();
    });

    it('should handle invalid draft ID', async () => {
      // Suppress console error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      (deleteDraft as jest.Mock).mockRejectedValue(new Error('Invalid draft ID'));

      const result = await handleDeleteDraft({ draftId: '' });
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Error deleting draft: Invalid draft ID');

      // Restore console.error
      consoleErrorSpy.mockRestore();
    });
  });

  // Rest of the test remains the same...
});
