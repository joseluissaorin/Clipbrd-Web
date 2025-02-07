# Clipbrd License Integration Guide

This guide explains how to implement license verification in your Clipbrd Python application.

## Requirements

```bash
pip install supabase-py requests keyring
```

## Implementation

### License Manager

```python
import keyring
import requests
from supabase import create_client, Client
import json
from typing import Optional, Dict, Any
import os
from datetime import datetime

class LicenseManager:
    def __init__(self):
        self.supabase_url = "https://YOUR_PROJECT_URL.supabase.co"
        self.supabase_key = "YOUR_ANON_KEY"  # Public anon key
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)
        
        # Constants
        self.APP_NAME = "Clipbrd"
        self.LICENSE_KEY = "license_key"
        self.USER_ID = "user_id"
        
    def get_stored_license(self) -> Optional[str]:
        """Get stored license key from system keyring."""
        return keyring.get_password(self.APP_NAME, self.LICENSE_KEY)
    
    def get_stored_user_id(self) -> Optional[str]:
        """Get stored user ID from system keyring."""
        return keyring.get_password(self.APP_NAME, self.USER_ID)
    
    def store_license(self, license_key: str, user_id: str) -> None:
        """Store license key and user ID in system keyring."""
        keyring.set_password(self.APP_NAME, self.LICENSE_KEY, license_key)
        keyring.set_password(self.APP_NAME, self.USER_ID, user_id)
    
    def clear_stored_license(self) -> None:
        """Clear stored license information."""
        try:
            keyring.delete_password(self.APP_NAME, self.LICENSE_KEY)
            keyring.delete_password(self.APP_NAME, self.USER_ID)
        except keyring.errors.PasswordDeleteError:
            pass

    async def activate_license(self, license_key: str) -> Dict[str, Any]:
        """
        Activate a license key and store it if valid.
        Returns the activation result with status and message.
        """
        try:
            # Query the licenses table for the provided key
            response = await self.supabase.rpc(
                'verify_license_key',
                {'input_key': license_key}
            ).execute()
            
            if response.data:
                license_data = response.data
                if license_data.get('is_valid'):
                    # Store the license information
                    self.store_license(license_key, license_data['user_id'])
                    return {
                        'status': 'success',
                        'message': 'License activated successfully',
                        'expires_at': license_data['expires_at']
                    }
                else:
                    return {
                        'status': 'error',
                        'message': license_data.get('message', 'Invalid license')
                    }
            else:
                return {
                    'status': 'error',
                    'message': 'Invalid license key'
                }
                
        except Exception as e:
            return {
                'status': 'error',
                'message': f'Activation error: {str(e)}'
            }

    async def verify_license(self) -> Dict[str, Any]:
        """
        Verify the stored license key.
        Returns verification result with status and message.
        """
        license_key = self.get_stored_license()
        if not license_key:
            return {
                'status': 'error',
                'message': 'No license key stored'
            }
            
        try:
            response = await self.supabase.rpc(
                'verify_license_key',
                {'input_key': license_key}
            ).execute()
            
            if response.data and response.data.get('is_valid'):
                return {
                    'status': 'success',
                    'message': 'License verified successfully',
                    'expires_at': response.data['expires_at']
                }
            else:
                # Clear invalid license
                self.clear_stored_license()
                return {
                    'status': 'error',
                    'message': 'License is no longer valid'
                }
                
        except Exception as e:
            return {
                'status': 'error',
                'message': f'Verification error: {str(e)}'
            }

    def is_license_expired(self, expires_at: str) -> bool:
        """Check if license is expired based on expiration date."""
        try:
            expiry_date = datetime.fromisoformat(expires_at.replace('Z', '+00:00'))
            return datetime.utcnow() > expiry_date
        except Exception:
            return True
```

### Usage Example

```python
import asyncio
from license_manager import LicenseManager

async def main():
    # Initialize license manager
    license_manager = LicenseManager()
    
    # Check for existing license
    stored_license = license_manager.get_stored_license()
    if stored_license:
        # Verify existing license
        result = await license_manager.verify_license()
        if result['status'] == 'success':
            print(f"License valid until: {result['expires_at']}")
            return True
        else:
            print(f"License verification failed: {result['message']}")
    
    # Activate new license
    license_key = input("Enter your license key: ")
    result = await license_manager.activate_license(license_key)
    
    if result['status'] == 'success':
        print(f"License activated successfully! Valid until: {result['expires_at']}")
        return True
    else:
        print(f"License activation failed: {result['message']}")
        return False

if __name__ == "__main__":
    # Run the async main function
    success = asyncio.run(main())
    
    if success:
        # Continue with app initialization
        pass
    else:
        # Exit or show activation required message
        pass
```

## Security Considerations

1. **License Key Storage**
   - License keys are securely stored using the system keyring
   - Never store license keys in plain text files
   - Clear invalid licenses immediately

2. **Offline Verification**
   - Implement a grace period for offline usage
   - Store last successful verification date
   - Require online verification periodically

3. **Error Handling**
   - Handle network errors gracefully
   - Provide clear error messages to users
   - Log verification attempts for troubleshooting

## Best Practices

1. **Initialization**
   - Verify license on application startup
   - Implement automatic renewal if supported
   - Handle activation/verification asynchronously

2. **User Experience**
   - Show clear activation status
   - Provide easy way to enter new license
   - Display expiration warnings in advance

3. **Maintenance**
   - Implement periodic license checks
   - Clean up invalid/expired licenses
   - Log license-related events for support

## Example Integration

Here's how to integrate the license manager into your Clipbrd application:

```python
class ClipbrdApp:
    def __init__(self):
        self.license_manager = LicenseManager()
        self.is_licensed = False
    
    async def initialize(self):
        """Initialize the application with license check."""
        # Verify license first
        result = await self.license_manager.verify_license()
        
        if result['status'] == 'success':
            self.is_licensed = True
            # Initialize app features
            await self.start_features()
        else:
            # Show activation dialog
            await self.show_activation_dialog()
    
    async def show_activation_dialog(self):
        """Show license activation dialog to user."""
        # Implement your UI for license activation
        license_key = await self.get_license_from_user()
        if license_key:
            result = await self.license_manager.activate_license(license_key)
            if result['status'] == 'success':
                self.is_licensed = True
                await self.start_features()
            else:
                await self.show_error_message(result['message'])
    
    async def start_features(self):
        """Start application features after license verification."""
        if not self.is_licensed:
            return
            
        # Initialize your app features here
        pass

# Application entry point
async def main():
    app = ClipbrdApp()
    await app.initialize()

if __name__ == "__main__":
    asyncio.run(main())
```

This implementation provides a secure and user-friendly way to handle license management in your Clipbrd application. Remember to replace the Supabase URL and anon key with your actual project credentials.