import NextAuth, { NextAuthOptions } from 'next-auth'
import { NextApiRequest, NextApiResponse } from 'next'
import FacebookProvider from 'next-auth/providers/facebook'
import GoogleProvider from 'next-auth/providers/google'
import { fauna } from '../../../services/faunadb'
import { query as q } from 'faunadb'

interface UserResponse {
  ref: {
    value: {
      id: string
    }
  }
  data: {
    id: string
    email: string
    isAvatarActive: boolean
    settings: {
      kickAlert: boolean
      goalSound: boolean
    }
  }
}

export function buildNextAuthOption(
  req: NextApiRequest,
  res: NextApiResponse,
): NextAuthOptions {
  return {
    providers: [
      FacebookProvider({
        clientId: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
      }),
    ],

    callbacks: {
      async signIn({ user, account }) {
        const { email } = user

        try {
          const response: UserResponse = await fauna.query(
            q.If(
              q.Not(
                q.Exists(q.Match(q.Index('user_by_email'), q.Casefold(email))),
              ),
              q.Create(q.Collection('users'), {
                data: {
                  email,
                  isAvatarActive: false,
                  preferences: { kickAlert: true, goalSound: true },
                },
              }),
              q.Get(q.Match(q.Index('user_by_email'), q.Casefold(email))),
            ),
          )

          // O userId vai ser o document ID do FaunaDB
          account.userId = response.ref.value.id

          account.isAvatarActive = response.data.isAvatarActive

          // const isAvatarActive = response.data.isAvatarActive
          // if (!isAvatarActive) {
          //   setCookie({ res }, 'brazucagol:isAvatarActive', 'false', {
          //     maxAge: 30 * 24 * 60 * 60, // 30 days
          //     path: '/',
          //   })
          // }

          return true
        } catch (err) {
          console.log('err', err)
          return false
        }
      },

      async jwt({ token, account, trigger, session }) {
        if (account) {
          // account only exists on first time user login
          token.userId = account.userId
          token.isAvatarActive = account.isAvatarActive
        }

        if (trigger === 'update' && session?.isAvatarActive) {
          token.isAvatarActive = session.isAvatarActive
        }

        return token
      },

      async session({ session, token }) {
        // user ref e user id (faunaDB)
        session.user.id = token.userId

        session.isAvatarActive = token.isAvatarActive

        return session

        // const { 'brazucagol:isAvatarActive': isAvatarActive } = parseCookies({
        //   req,
        // })

        // if (!isAvatarActive) {
        //   // Cookie doesn't exists
        //   return {
        //     ...session,
        //     isAvatarActive: true,
        //   }
        // } else {
        //   const isAvatarActiveBoolean = isAvatarActive === 'true'
        //   return {
        //     ...session,
        //     isAvatarActive: isAvatarActiveBoolean,
        //   }
        // }

        // const { email } = session.user

        // try {
        //   await fauna.query(
        //     q.Get(
        //       q.Intersection([
        //         q.Match(q.Index('user_by_email'), q.Casefold(email)),
        //         q.Match(q.Index('user_by_isAvatarActive'), true),
        //       ]),
        //     ),
        //   )

        //   return {
        //     ...session,
        //     isAvatarActive: true,
        //   }
        // } catch {
        //   return {
        //     ...session,
        //     isAvatarActive: false,
        //   }
        // }
      },
    },

    secret: process.env.NEXTAUTH_SECRET,
  }
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, buildNextAuthOption(req, res))
}
