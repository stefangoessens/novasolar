# Setting Up an Admin Account in Supabase

To create an admin user for your application, follow these steps:

## 1. Navigate to your Supabase Project Dashboard

Go to: https://app.supabase.com/project/_/auth/users

## 2. Add a New User

Click on "Add User" button.

## 3. Enter User Details

- **Email**: Enter your admin email address
- **Password**: Create a strong password

## 4. Verify Email (if required)

If email confirmation is enabled:
1. Check your email inbox
2. Click the verification link

## 5. Testing Admin Access

After setting up your admin account, you can now log in to your application's admin dashboard using these credentials.

---

## Additional Authentication Options

### Disabling Email Confirmation (for testing)

If you're just testing and want to skip email confirmation:

1. Go to Authentication > Providers
2. Under "Email Auth" section, toggle off "Confirm Email"
3. Save changes

### Advanced Settings

For additional security, you can add custom claims to your admin user:

1. Go to Authentication > Users
2. Click on your admin user
3. Click "Edit User"
4. Add a custom claim like: `{"admin": true}`

You can then modify your RLS policies to only allow users with the admin claim to access certain resources.

```sql
CREATE POLICY "Allow admin access" 
ON "public"."settings" FOR DELETE 
TO authenticated 
USING (auth.jwt() ->> 'admin' = 'true');
```