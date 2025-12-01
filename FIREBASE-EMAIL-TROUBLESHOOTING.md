# Firebase Email Verification Troubleshooting Guide

## ✅ What I've Fixed in the Code

1. **Added `actionCodeSettings`** to `sendEmailVerification()` - This tells Firebase where to redirect users after clicking the verification link
2. **Better error handling** - Wrapped Firestore and email operations in try-catch blocks
3. **Created verification callback page** - `/verify-email` route handles the email link clicks
4. **Added "Resend Verification Email" button** - Users can request a new email from the login page
5. **Improved logging** - Console logs now show detailed error information

## 🔍 Steps to Check in Firebase Console

### Step 1: Check Authorized Domains
**CRITICAL - This is often the issue!**

1. Go to Firebase Console → Authentication → Settings
2. Scroll down to **"Authorized domains"**
3. Make sure `localhost` is listed (for development)
4. Make sure your production domain is listed (if deployed)
5. Click **"Add domain"** if `localhost` is missing

**Why this matters:** Firebase only sends emails if the domain is authorized. If `localhost` isn't in the list, emails won't send during development.

### Step 2: Verify Email Template Configuration
1. Go to Authentication → Templates
2. Click on **"Email address verification"**
3. Ensure:
   - Template is enabled
   - Sender email is set: `noreply@um6p-solidarity-network.firebaseapp.com`
   - Subject and body are configured
   - Click **"Save"** if you made changes

### Step 3: Check Email/Password Provider
1. Go to Authentication → Sign-in method
2. Click on **"Email/Password"**
3. Ensure:
   - **Email/Password** toggle is ON
   - **Email link (passwordless)** can be ON or OFF (doesn't matter for our use case)

### Step 4: Test Email Sending Manually
1. Go to Authentication → Users
2. Find your test user (e.g., `adam.amrid@um6p.ma`)
3. Click on the user
4. Look for **"Send email verification"** button
5. Click it
6. Check your email inbox (and spam folder)

### Step 5: Check Browser Console for Errors
1. Open your app in browser
2. Press F12 to open DevTools
3. Go to Console tab
4. Try signing up
5. Look for any error messages
6. Common errors:
   - `auth/unauthorized-domain` → Add domain to authorized domains
   - `auth/too-many-requests` → Wait a few minutes
   - `auth/network-request-failed` → Check internet connection

## 🐛 Common Issues & Solutions

### Issue: "auth/unauthorized-domain" error
**Solution:** Add `localhost` to authorized domains in Firebase Console → Authentication → Settings

### Issue: Emails go to spam
**Solution:** 
- Check spam/junk folder
- Add `noreply@um6p-solidarity-network.firebaseapp.com` to safe senders
- Wait 2-5 minutes (email delivery can be delayed)

### Issue: No email received at all
**Solutions:**
1. Check authorized domains (most common issue)
2. Verify email template is saved
3. Check Firebase quotas (free tier has limits)
4. Try different email provider (Gmail vs Outlook)
5. Check browser console for errors

### Issue: Form keeps loading
**Solution:** The code now has better error handling. Check browser console (F12) for the actual error.

## 📧 Testing Checklist

- [ ] `localhost` is in authorized domains
- [ ] Email/Password provider is enabled
- [ ] Email template is configured and saved
- [ ] Browser console shows no errors
- [ ] Tried with Gmail address
- [ ] Tried with Outlook address
- [ ] Checked spam folder
- [ ] Waited 2-5 minutes for email delivery

## 🔗 Important URLs

- **Verification callback:** `http://localhost:5173/verify-email?mode=verifyEmail&oobCode=...`
- **Firebase Console:** https://console.firebase.google.com/project/um6p-solidarity-network/authentication

## 📝 Next Steps

If emails still don't work after checking authorized domains:

1. **Check Firebase quotas:** Go to Usage and billing to see if you've hit email limits
2. **Try manual send:** Use Firebase Console to manually send verification email
3. **Check email service status:** Firebase email service might be experiencing delays
4. **Consider alternative:** Use a custom email service (SendGrid, Mailgun) via Cloud Functions

