import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOption } from '../auth/[...nextauth]'
import { query as q } from 'faunadb'
import { fauna } from '../../../services/faunadb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method === 'DELETE') {
    const session = await getServerSession(
      req,
      res,
      buildNextAuthOption(req, res),
    )

    try {
      await fauna.query(
        q.Delete(q.Ref(q.Collection('users'), session.user.documentIdFauna)),
      )

      return res.status(200).json({ deleted: true })
    } catch (error) {
      return res.status(400).json({ error })
    }
  }

  return res.status(405).json({ err: `Method ${req.method} Not Allowed` })
}
