import { describe, expect, test, beforeAll, afterAll, jest } from '@jest/globals';
import { POST as verifyLicenseHandler } from '@/app/api/license/verify/route';
import { GET as listLicensesHandler } from '@/app/api/license/list/route';
import { POST as deactivateAccountHandler } from '@/app/api/account/deactivate/route';
import { 
  createTestUser, 
  createTestSubscription, 
  createTestLicense,
  cleanupTestData,
  mockResponse,
  mockRateLimiter,
  mockAnalytics
} from './utils';
import { generateApiKey } from '@/libs/security';

// Mock dependencies
jest.mock('@/libs/rate_limiter', () => mockRateLimiter);
jest.mock('@/libs/analytics', () => mockAnalytics);

describe('API Endpoints', () => {
  let testUser;
  let testSubscription;
  let testLicense;
  let apiKey;

  beforeAll(async () => {
    // Create test data
    testUser = await createTestUser();
    testSubscription = await createTestSubscription(testUser.user.id);
    const licenseData = await createTestLicense(testUser.user.id, testSubscription.subscriptionId);
    testLicense = licenseData.license;
    apiKey = generateApiKey(testUser.user.id);
  });

  afterAll(async () => {
    await cleanupTestData(testUser.user.id);
  });

  describe('License Verification Endpoint', () => {
    test('should verify valid license', async () => {
      const req = new Request('http://localhost/api/license/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey
        },
        body: JSON.stringify({ licenseKey: testLicense.key })
      });

      const response = await verifyLicenseHandler(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.is_valid).toBe(true);
      expect(data.expires_at).toBeDefined();
    });

    test('should reject invalid API key', async () => {
      const req = new Request('http://localhost/api/license/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'invalid-key'
        },
        body: JSON.stringify({ licenseKey: testLicense.key })
      });

      const response = await verifyLicenseHandler(req);
      expect(response.status).toBe(401);
    });

    test('should handle rate limiting', async () => {
      // Mock rate limit exceeded
      mockRateLimiter.checkRateLimit.mockResolvedValueOnce({
        success: false,
        retryAfter: 3600,
        message: 'Rate limit exceeded'
      });

      const req = new Request('http://localhost/api/license/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey
        },
        body: JSON.stringify({ licenseKey: testLicense.key })
      });

      const response = await verifyLicenseHandler(req);
      expect(response.status).toBe(429);
      expect(response.headers.get('Retry-After')).toBe('3600');
    });
  });

  describe('License List Endpoint', () => {
    test('should list user licenses', async () => {
      const req = new Request('http://localhost/api/license/list');
      const context = { params: {}, auth: { user: testUser.user } };

      const response = await listLicensesHandler(req, context);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data.licenses)).toBe(true);
      expect(data.licenses.length).toBeGreaterThan(0);
      expect(data.licenses[0].key).toBe(testLicense.key);
    });

    test('should require authentication', async () => {
      const req = new Request('http://localhost/api/license/list');
      const context = { params: {}, auth: { user: null } };

      const response = await listLicensesHandler(req, context);
      expect(response.status).toBe(401);
    });
  });

  describe('Account Deactivation Endpoint', () => {
    test('should deactivate account', async () => {
      const req = new Request('http://localhost/api/account/deactivate', {
        method: 'POST'
      });
      const context = { params: {}, auth: { user: testUser.user } };

      const response = await deactivateAccountHandler(req, context);
      expect(response.status).toBe(200);

      // Verify account is deactivated
      const { data: profile } = await supabase
        .from('profiles')
        .select('status')
        .eq('id', testUser.user.id)
        .single();

      expect(profile.status).toBe('inactive');
    });

    test('should require authentication', async () => {
      const req = new Request('http://localhost/api/account/deactivate', {
        method: 'POST'
      });
      const context = { params: {}, auth: { user: null } };

      const response = await deactivateAccountHandler(req, context);
      expect(response.status).toBe(401);
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid JSON', async () => {
      const req = new Request('http://localhost/api/license/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey
        },
        body: 'invalid-json'
      });

      const response = await verifyLicenseHandler(req);
      expect(response.status).toBe(400);
    });

    test('should handle missing license key', async () => {
      const req = new Request('http://localhost/api/license/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey
        },
        body: JSON.stringify({})
      });

      const response = await verifyLicenseHandler(req);
      expect(response.status).toBe(400);
    });

    test('should handle database errors', async () => {
      // Mock database error
      jest.spyOn(supabase, 'from').mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      const req = new Request('http://localhost/api/license/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey
        },
        body: JSON.stringify({ licenseKey: testLicense.key })
      });

      const response = await verifyLicenseHandler(req);
      expect(response.status).toBe(500);
    });
  });
}); 