import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOption } from '../../auth/[...nextauth]'
import { fauna } from '../../../../services/faunadb'
import { query as q } from 'faunadb'

interface RequestBody {
  combinedId: string
}

interface UserChats {
  data: {
    unreadChats: []
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method === 'GET') {
    const { user } = await getServerSession(
      req,
      res,
      buildNextAuthOption(req, res),
    )

    try {
      const unreadChats = await fauna.query(
        q.Select(
          ['data', 'unreadChats'],
          q.Get(q.Match(q.Index('userChats_by_userId'), user.id)),
        ),
      )

      return res.status(200).json(unreadChats)
    } catch (error) {
      return res.status(400).json({ error })
    }
  }

  if (req.method === 'POST') {
    const { combinedId }: RequestBody = req.body

    const { user } = await getServerSession(
      req,
      res,
      buildNextAuthOption(req, res),
    )

    try {
      const response = await fauna.query<UserChats>(
        q.Let(
          {
            ref: q.Select(
              'ref',
              q.Get(q.Match(q.Index('userChats_by_userId'), user.id)),
            ),
            unreadChatsUpdated: q.Filter(
              q.Select(['data', 'unreadChats'], q.Get(q.Var('ref'))),
              q.Lambda(
                'chatCombinedId',
                q.Not(q.Equals(q.Var('chatCombinedId'), combinedId)),
              ),
            ),
          },
          q.Update(q.Var('ref'), {
            data: {
              unreadChats: q.Var('unreadChatsUpdated'),
            },
          }),
        ),
      )

      return res
        .status(201)
        .json({ success: true, unreadChats: response.data.unreadChats })
    } catch (error) {
      return res.status(400).json({ error })
    }
  }

  return res.status(405).json({ err: `Method ${req.method} Not Allowed` })
}
