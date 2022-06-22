import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { fauna } from '../../services/faunadb'
import { query as q } from 'faunadb'

interface IndividualGoalsQueryResponse {
  data: {
    userId: {
      id: string
    },     
    avatarAutoGoals: number,
    avatarPenaltyGoals: number,
    avatarFreeKickGoals: number,
    avatarTrailGoals: number
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

    const { data } = await fauna.query<IndividualGoalsQueryResponse>(
      q.Get(
        q.Match(
          q.Index("individualGoals_by_userId"),
          userRef
        )
      )
    )

    return res.json({ data })
  }

  if (req.method === 'POST') {
    const { kickType, goals } = req.body
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

    await fauna.query(
      q.Update(
        q.Select(
          "ref",
          q.Get(
            q.Match(
              q.Index("individualGoals_by_userId"),
              userRef
            )
          )
        ),
        {
          data: {
            [kickType]: goals + 1
          }
        }
      )
    )

    return res.status(201).json({ success: true })
  }

  return res.status(405).json({ err: `Method ${req.method} Not Allowed` })
}