import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { fauna } from '../../services/faunadb'
import { query as q } from 'faunadb'
import { buildNextAuthOption } from './auth/[...nextauth]'

interface IndividualGoalsQueryResponse {
  data: {
    userId: {
      id: string
    }
    avatarAutoGoals: number
    avatarPenaltyGoals: number
    avatarFreeKickGoals: number
    avatarTrailGoals: number
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method === 'GET') {
    const session = await getServerSession(
      req,
      res,
      buildNextAuthOption(req, res),
    )
    if (!session) return res.status(400).send('Session não iniciada')
    if (session.isAvatarActive === false) {
      return res.status(400).send('Avatar não está ativo')
    }

    try {
      const userRef = await fauna.query(
        q.Select(
          'ref',
          q.Get(q.Match(q.Index('user_by_email'), session?.user.email)),
        ),
      )

      const { data } = await fauna.query<IndividualGoalsQueryResponse>(
        q.Get(q.Match(q.Index('individualGoals_by_userId'), userRef)),
      )

      return res.status(200).json({ data })
    } catch (err) {
      return res.status(400).json({ message: err })
    }
  }

  if (req.method === 'POST') {
    const { kickData } = req.body
    const { user } = await getServerSession(
      req,
      res,
      buildNextAuthOption(req, res),
    )

    const userRef = await fauna.query(
      q.Select('ref', q.Get(q.Match(q.Index('user_by_email'), user.email))),
    )
    await fauna.query(
      q.Update(
        q.Select(
          'ref',
          q.Get(q.Match(q.Index('individualGoals_by_userId'), userRef)),
        ),
        {
          data: kickData,
        },
      ),
    )

    return res.status(201).json({ success: true })
  }

  return res.status(405).json({ err: `Method ${req.method} Not Allowed` })
}
