import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { query as q } from 'faunadb'
import { fauna } from '../../services/faunadb'

interface AvatarQueryResponse {
  data: {
    name: string,
    clubId: number,
    userId: {
      id: string
    }
  }
}

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
): Promise<void> {
  if (req.method === 'GET') {
    const { user } = await getSession({ req })

    const userRef = await fauna.query(
      q.Select(
        "ref",
        q.Get(
          q.Match(
            q.Index("user_by_email"),
            user.email
          )
        )
      )
    )

    return fauna.query<AvatarQueryResponse>(
      q.Get(
        q.Match(
          q.Index("avatar_by_userId"),
          userRef
        )
      )
    ).then(response => {

      return res.json({
        data: response
      })
    }).catch(err => {
      return res.status(400).json({ err })
    })
  }

  return res.status(405).json({ err: `Method ${req.method} Not Allowed` })
}