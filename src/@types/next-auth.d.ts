// eslint-disable-next-line no-unused-vars
import NextAuth, { DefaultSession } from 'next-auth'
// import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  // eslint-disable-next-line no-unused-vars
  interface Session {
    isAvatarActive: boolean
    user: {
      documentIdFauna: string
    } & DefaultSession['user']
  }

  // eslint-disable-next-line no-unused-vars
  interface Account {
    documentIdFauna: string
    isAvatarActive: boolean
  }
}

declare module 'next-auth/jwt' {
  // eslint-disable-next-line no-unused-vars
  interface JWT {
    documentIdFauna: string
    isAvatarActive: boolean
  }
}
