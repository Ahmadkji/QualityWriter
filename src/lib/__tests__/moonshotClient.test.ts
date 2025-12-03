import { moonshotClient } from '../moonshotClient';

describe('MoonshotClient', () => {
  describe('estimateTokens', () => {
    it('should estimate tokens correctly', () => {
      const text = 'Hello world, this is a test.';
      const estimated = moonshotClient.estimateTokens(text);
      expect(estimated).toBeGreaterThan(0);
      expect(estimated).toBeLessThan(50); // Should be reasonable
    });
  });

  describe('validateApiKey', () => {
    it('should handle API key validation', async () => {
      // This is a mock test - in real usage, you'd need a valid API key
      const result = await moonshotClient.validateApiKey();
      expect(typeof result).toBe('boolean');
    });
  });
});