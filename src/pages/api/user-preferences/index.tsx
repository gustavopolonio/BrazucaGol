import { NextApiRequest, NextApiResponse } from 'next'
import { query as q } from 'faunadb'
import { fauna } from '../../../services/faunadb'
import { Session, getServerSession } from 'next-auth'
import { buildNextAuthOption } from '../auth/[...nextauth]'

interface UserPreferences {
  kickAlert: boolean
  goalSound: boolean
}

export async function getUserPreferences(session: Session) {
  const userPreferences: UserPreferences = await fauna.query(
    q.Select(
      ['data', 'preferences'],
      q.Get(q.Match(q.Index('user_by_email'), session.user.email)),
    ),
  )

  return userPreferences
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
      const userPreferences = await getUserPreferences(session)
      return res.status(200).json({ userPreferences })
    } catch (err) {
      return res.status(400).json({ err })
    }
  }

  if (req.method === 'POST') {
    const { goalAlert, kickIsReadyAlert } = req.body

    const { user } = await getServerSession(
      req,
      res,
      buildNextAuthOption(req, res),
    )

    try {
      await fauna.query(
        q.Update(
          q.Select('ref', q.Get(q.Match(q.Index('user_by_email'), user.email))),
          {
            data: {
              preferences: {
                kickAlert: kickIsReadyAlert,
                goalSound: goalAlert,
              },
            },
          },
        ),
      )

      return res.status(201).json({ success: true })
    } catch (err) {
      return res.status(400).json({ err })
    }
  }

  return res.status(405).json({ err: `Method ${req.method} Not Allowed` })
}
