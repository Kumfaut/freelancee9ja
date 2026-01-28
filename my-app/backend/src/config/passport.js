import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import db from "./db.js";

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // 1. Check if user exists in your DB
      const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [profile.emails[0].value]);
      
      if (rows.length > 0) {
        return done(null, rows[0]);
      } else {
        // 2. If not, create them!
        const [result] = await db.execute(
          "INSERT INTO users (full_name, email, role, is_verified) VALUES (?, ?, ?, ?)",
          [profile.displayName, profile.emails[0].value, 'freelancer', 1]
        );
        const newUser = { id: result.insertId, email: profile.emails[0].value };
        return done(null, newUser);
      }
    } catch (err) {
      return done(err, null);
    }
  }
));

export default passport;