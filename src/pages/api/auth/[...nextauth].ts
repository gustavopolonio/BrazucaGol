import NextAuth from 'next-auth'
import FacebookProvider from "next-auth/providers/facebook"
import GoogleProvider from 'next-auth/providers/google'
import { fauna } from '../../../services/faunadb'
import { query as q } from 'faunadb'

export default NextAuth({
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    })
  ],

  callbacks: {
    async signIn({ user }) {
      const { email } = user

      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(email)
                )
              )
            ),
            q.Create(
              q.Collection('users'),
              { data: { email, isAvatarActive: false } }
            ),
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(email)
              )
            )
          )
        )

        return true

      } catch(err) {
        console.log('err', err)
        return false
      }

    },

    async session({ session }) {
      const { email } = session.user

      try {
        await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(email)
              ),
              q.Match(
                q.Index('user_by_isAvatarActive'),
                true
              )
            ])
          )
        )

        return {
          ...session,
          isAvatarActive: true
        }
      } catch {

        return {
          ...session,
          isAvatarActive: false
        }
      }
    }
  }
})