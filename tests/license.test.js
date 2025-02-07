import { describe, expect, test, beforeAll, afterAll, jest } from '@jest/globals';
import { verifyLicense, generateLicense } from '@/libs/licenses';
import { createTestUser, createTestSubscription, cleanupTestData } from './utils';
import { generateSecureToken } from '@/libs/security';

describe('License Management', () => {
  let testUser;
  let testSubscription;
  let testLicense;

  beforeAll(async () => {
    // Create test user and subscription
    testUser = await createTestUser();
    testSubscription = await createTestSubscription(testUser.user.id);
  });

  afterAll(async () => {
    // Clean up test data
    await cleanupTestData(testUser.user.id);
  });

  describe('License Generation', () => {
    test('should generate a valid license', async () => {
      testLicense = await generateLicense(
        testUser.user.id,
        testSubscription.subscriptionId,
        testSubscription.expiresAt
      );

      expect(testLicense).toBeDefined();
      expect(testLicense.key).toMatch(/^CLPB-/);
      expect(testLicense.status).toBe('active');
      expect(new Date(testLicense.expires_at)).toEqual(testSubscription.expiresAt);
    });

    test('should not generate license without user ID', async () => {
      await expect(
        generateLicense(
          null,
          testSubscription.subscriptionId,
          testSubscription.expiresAt
        )
      ).rejects.toThrow();
    });

    test('should not generate license without subscription ID', async () => {
      await expect(
        generateLicense(
          testUser.user.id,
          null,
          testSubscription.expiresAt
        )
      ).rejects.toThrow();
    });
  });

  describe('License Verification', () => {
    test('should verify valid license', async () => {
      const result = await verifyLicense(testLicense.key);
      
      expect(result.is_valid).toBe(true);
      expect(result.message).toBe('License is valid');
      expect(new Date(result.expires_at)).toEqual(testSubscription.expiresAt);
    });

    test('should reject invalid license key', async () => {
      const result = await verifyLicense('INVALID-KEY');
      
      expect(result.is_valid).toBe(false);
      expect(result.message).toBe('Invalid license key');
    });

    test('should reject expired license', async () => {
      // Create expired license
      const expiredDate = new Date();
      expiredDate.setDate(expiredDate.getDate() - 1);
      
      const expiredLicense = await generateLicense(
        testUser.user.id,
        testSubscription.subscriptionId,
        expiredDate
      );

      const result = await verifyLicense(expiredLicense.key);
      
      expect(result.is_valid).toBe(false);
      expect(result.message).toBe('License has expired');
    });

    test('should reject tampered license', async () => {
      // Generate license with modified data
      const tamperedLicense = await generateLicense(
        testUser.user.id,
        testSubscription.subscriptionId,
        testSubscription.expiresAt
      );

      // Modify the signature
      tamperedLicense.signature = generateSecureToken();

      const result = await verifyLicense(tamperedLicense.key);
      
      expect(result.is_valid).toBe(false);
      expect(result.message).toBe('License signature is invalid');
    });
  });

  describe('License Usage Tracking', () => {
    test('should record license usage on verification', async () => {
      const result = await verifyLicense(testLicense.key);
      expect(result.is_valid).toBe(true);

      // Check if usage was recorded
      const { data: usage } = await supabase
        .from('license_usage')
        .select('*')
        .eq('license_id', testLicense.id)
        .single();

      expect(usage).toBeDefined();
      expect(usage.requests).toBe(1);
      expect(new Date(usage.last_request_at)).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    test('should handle database errors gracefully', async () => {
      // Mock database error
      jest.spyOn(supabase, 'from').mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      await expect(verifyLicense(testLicense.key)).rejects.toThrow();
    });

    test('should handle encryption errors gracefully', async () => {
      // Mock encryption error
      jest.spyOn(crypto, 'createDecipheriv').mockImplementationOnce(() => {
        throw new Error('Encryption error');
      });

      await expect(verifyLicense(testLicense.key)).rejects.toThrow();
    });

    test('should handle invalid input gracefully', async () => {
      await expect(verifyLicense(null)).rejects.toThrow();
      await expect(verifyLicense('')).rejects.toThrow();
      await expect(verifyLicense(123)).rejects.toThrow();
    });
  });
}); 