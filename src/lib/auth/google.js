import GoogleStrategy from "passport-google-oauth20"
import UsersModel from "../../users/model.js"
import { createTokens } from "./tools.js"

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: `${process.env.BE_URL}/users/googleRedirect`, // this needs to match EXACTLY with the url configured on Google Cloud Console
  },
  async (_, __, profile, passportNext) => {
    // This callback function is executed when Google sends us a successfull response back
    // Here we are going to receive some informations about the user from Google (scopes --> profile, email)
    console.log("PROFILE: ", profile)
    try {
      const { email, given_name, family_name } = profile._json

      // 1. Check if the user is already in db
      const user = await UsersModel.findOne({ email })

      if (user) {
        // 2. If he is there --> generate an accessToken (optionally a refreshToken as well)
        const { accessToken } = await createTokens(user)

        // 2.1 Then we can go next (to /googleRedirect route handler function), passing the token
        passportNext(null, { accessToken })
      } else {
        // 3. If user is not in our db --> create that user
        const newUser = new UsersModel({
          firstName: given_name,
          lastName: family_name,
          email,
          googleId: profile.id,
        })
        const createdUser = await newUser.save()

        // 3.1 Then we can go next (to /googleRedirect route handler function), passing the token
        const { accessToken } = await createTokens(createdUser)
        passportNext(null, { accessToken })
      }
    } catch (error) {
      // 4. In case of errors we are going to catch'em
      passportNext(error)
    }
  }
)

export default googleStrategy
