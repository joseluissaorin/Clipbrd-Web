import { verifyLicense } from "@/libs/licenses";
import { checkRateLimit, recordFailedAttempt } from "@/libs/rate_limiter";
import { verifyApiKey } from "@/libs/security";
import { createClient } from "@/libs/supabase/server";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(req) {
  const supabase = createClient();
  
  try {
    // Verify API key
    const apiKey = headers().get("X-API-Key");
    if (!apiKey || !verifyApiKey(apiKey)) {
      // Track failed API key verification
      await supabase.from('analytics_events').insert({
        event_type: 'license_verify_failed',
        event_data: { reason: 'invalid_api_key' }
      });
      
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { licenseKey } = body;

    if (!licenseKey) {
      // Track missing license key
      await supabase.from('analytics_events').insert({
        event_type: 'license_verify_failed',
        event_data: { reason: 'missing_license_key' }
      });
      
      return NextResponse.json(
        { error: "License key is required" },
        { status: 400 }
      );
    }

    // Check rate limit
    const rateLimit = await checkRateLimit(licenseKey);
    if (!rateLimit.success) {
      // Track rate limit exceeded
      await supabase.from('analytics_events').insert({
        event_type: 'rate_limit_exceeded',
        event_data: { 
          license_key: licenseKey,
          retry_after: rateLimit.retryAfter
        }
      });
      
      return NextResponse.json(
        { 
          error: rateLimit.message,
          retryAfter: rateLimit.retryAfter
        },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimit.retryAfter.toString(),
            'X-RateLimit-Limit': '360',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': (Date.now() + rateLimit.retryAfter * 1000).toString()
          }
        }
      );
    }

    const result = await verifyLicense(licenseKey);

    // Track verification result
    await supabase.from('analytics_events').insert({
      event_type: result.is_valid ? 'license_verify_success' : 'license_verify_failed',
      event_data: { 
        license_key: licenseKey,
        reason: result.message
      }
    });

    // Record failed attempts for additional rate limiting
    if (!result.is_valid) {
      const failedLimit = await recordFailedAttempt(licenseKey);
      if (!failedLimit.success) {
        // Track failed attempt limit exceeded
        await supabase.from('analytics_events').insert({
          event_type: 'failed_attempts_limit_exceeded',
          event_data: { 
            license_key: licenseKey,
            retry_after: failedLimit.retryAfter
          }
        });
        
        return NextResponse.json(
          { 
            error: "Too many failed attempts. Please try again later.",
            retryAfter: failedLimit.retryAfter
          },
          { 
            status: 429,
            headers: {
              'Retry-After': failedLimit.retryAfter.toString(),
              'X-RateLimit-Reset': (Date.now() + failedLimit.retryAfter * 1000).toString()
            }
          }
        );
      }
    }

    // Set security headers
    const headers = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };

    return NextResponse.json(result, { headers });
  } catch (e) {
    console.error(e);
    
    // Track unexpected errors
    await supabase.from('analytics_events').insert({
      event_type: 'license_verify_error',
      event_data: { 
        error: e.message || 'Unknown error'
      }
    });
    
    return NextResponse.json(
      { error: "Error verifying license" },
      { status: 500 }
    );
  }
}

export const runtime = "edge"; 