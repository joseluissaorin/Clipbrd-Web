# Clipbrd - Your AI-Powered Study Companion

Clipbrd is a revolutionary AI-powered clipboard manager that seamlessly integrates with your study workflow. Whether you're tackling multiple-choice questions or crafting detailed responses, Clipbrd works silently in the background to provide instant, context-aware answers using your personal notes and files.

## Features

- 🤖 **AI-Powered Assistance**: Get intelligent answers to your questions instantly
- 📚 **Context-Aware**: Uses your own notes and files as reference material
- 🖼️ **Image Support**: Works with both text and image-based content
- 🔄 **Universal Compatibility**: Functions even with copy-protected text
- 🤫 **Discrete Operation**: Works silently in the background
- ✅ **Smart MCQ Support**: Perfect for multiple-choice questions and long-form answers
- 📖 **Open Source**: Full transparency - check our code for complete peace of mind

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- Stripe account (for payments)
- Umami Analytics (optional)

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Security
ENCRYPTION_KEY=your_32_byte_encryption_key

# Analytics
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your_umami_website_id
NEXT_PUBLIC_UMAMI_URL=your_umami_url
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/joseluissaorin/Clipbrd.git
cd clipbrd
```

2. Install dependencies:
```bash
npm install
```

3. Run database migrations:
```bash
npx supabase db push
```

4. Start the development server:
```bash
npm run dev
```

## Architecture

### Backend Services

- **Supabase**: Database and authentication
- **Stripe**: Payment processing and subscription management
- **Umami**: Privacy-focused analytics

### Key Components

- `libs/`: Core utilities and business logic
  - `security.js`: Encryption and key management
  - `licenses.js`: License generation and verification
  - `subscription.js`: Subscription management
  - `analytics.js`: Usage tracking
  - `rate_limiter.js`: Rate limiting
  - `user.js`: User management

- `app/`: Next.js application routes and components
  - `api/`: Backend API endpoints
  - `dashboard/`: User dashboard
  - `account/`: Account management

### Security Features

- AES-256-GCM encryption for sensitive data
- PBKDF2 key derivation for license hashing
- HMAC signatures for data integrity
- Rate limiting for API endpoints
- Secure headers and XSS protection

## API Documentation

### License Verification

```http
POST /api/license/verify
Content-Type: application/json
X-API-Key: your_api_key

{
  "licenseKey": "CLPB-XXXXX-XXXXX"
}
```

Response:
```json
{
  "is_valid": true,
  "expires_at": "2025-01-01T00:00:00Z",
  "message": "License is valid"
}
```

Rate Limits:
- 360 requests per hour per license key
- 10 failed attempts per hour

### License Management

```http
GET /api/license/list
Authorization: Bearer your_jwt_token
```

Response:
```json
{
  "licenses": [
    {
      "id": "uuid",
      "key": "CLPB-XXXXX-XXXXX",
      "status": "active",
      "expires_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@clipbrdapp.com or visit our [documentation](https://docs.clipbrdapp.com).
