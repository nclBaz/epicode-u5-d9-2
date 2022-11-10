import GoogleStrategy from "passport-google-oauth20"

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: `${process.env.BE_URL}/users/googleRedirect`, // this needs to match EXACTLY with the url configured on Google Cloud Console
  },
  (accessToken, refreshToken, profile, cb) => {}
)

export default googleStrategy
