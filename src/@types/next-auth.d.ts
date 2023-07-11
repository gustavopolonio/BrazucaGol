// eslint-disable-next-line no-unused-vars
import NextAuth, { DefaultSession } from 'next-auth'
// import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  // eslint-disable-next-line no-unused-vars
  interface Session {
    isAvatarActive: boolean
    user: {
      id: string
    } & DefaultSession['user']
  }

  // eslint-disable-next-line no-unused-vars
  interface Account {
    userId: string
    isAvatarActive: boolean
  }
}

declare module 'next-auth/jwt' {
  // eslint-disable-next-line no-unused-vars
  interface JWT {
    userId: string
    isAvatarActive: boolean
  }
}
