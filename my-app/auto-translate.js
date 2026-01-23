const { TranslationServiceClient } = require('@google-cloud/translate');
const fs = require('fs');
const path = require('path');

// 1. THIS IS THE CRITICAL FIX: Tell the script EXACTLY where the key is
const KEY_FILE_PATH = path.join(__dirname, 'gcp-key.json');

const translationClient = new TranslationServiceClient({
  keyFilename: KEY_FILE_PATH
});

const projectId = 'naijafreelance-i18n'; 

// 2. CLEANED ENGLISH BLOCK (Extracted from your i18n structure)
const englishStrings = {
    "welcome_back": "Welcome back",
    "signin_subtitle": "Sign in to your NaijaFreelance account",
    "login_btn": "Sign In",
    "enter_details": "Enter your email and password to continue",
    "email_label": "Email Address",
    "pass_label": "Password",
    "forgot_password": "Forgot password?",
    "remember_me": "Remember me for 30 days",
    "signing_in": "Signing in...",
    "or_continue": "Or continue with",
    "no_account": "Don't have an account?",
    "signup_free": "Sign up for free",
    "create_account": "Create Account",
    "signup_subtitle": "Join the NaijaFreelance community today",
    "full_name": "Full Name",
    "confirm_password": "Confirm Password",
    "i_agree": "I agree to the Terms of Service",
    "dash_welcome": "Welcome back",
    "wallet_title": "Wallet",
    "available_balance": "Available Balance",
    "withdraw_funds": "Withdraw Funds",
    "escrow_title": "Escrow Protection Active",
    "settings_title": "Settings",
    "settings_subtitle": "Manage your account and preferences.",
    "tab_account": "Account",
    "tab_alerts": "Alerts",
    "tab_payment": "Payment",
    "tab_privacy": "Privacy",
    "tab_security": "Security",
    "profile_details": "Profile Details",
    "save_profile": "Save Profile",
    "danger_zone": "Danger Zone",
    "delete_account": "Delete Account",
    "update_password": "Update Password"
};

async function translateAll() {
  const languages = [
    { code: 'ha', name: 'Hausa' },
    { code: 'ig', name: 'Igbo' },
    { code: 'yo', name: 'Yoruba' }
  ];

  const finalResult = {};

  for (const lang of languages) {
    console.log(`--- Starting ${lang.name} ---`);
    finalResult[lang.code] = {};

    for (const [key, value] of Object.entries(englishStrings)) {
      try {
        const request = {
          parent: `projects/${projectId}/locations/global`,
          contents: [value],
          mimeType: 'text/plain',
          targetLanguageCode: lang.code,
        };

        const [response] = await translationClient.translateText(request);
        finalResult[lang.code][key] = response.translations[0].translatedText;
        console.log(`✅ ${lang.code}: [${key}] translated.`);
      } catch (err) {
        console.error(`❌ Error on ${key}:`, err.message);
      }
    }
  }

  fs.writeFileSync('./new_translations.json', JSON.stringify(finalResult, null, 2));
  console.log('\n✨ DONE! Check your folder for new_translations.json');
}

translateAll().catch(console.error);