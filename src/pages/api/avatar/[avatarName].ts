import { NextApiRequest, NextApiResponse } from 'next'
import { fauna } from '../../../services/faunadb'
import { query as q } from 'faunadb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {

  if (req.method === 'GET') {
    const { avatarName } = req.query

    let avatarExists: boolean
    
    try {
      avatarExists = await fauna.query(
        q.If(
          q.Exists(
            q.Match(
              q.Index('avatar_by_name'),
              avatarName
            )
          ),
          true,
          false
        )
      )
    } catch (err) {
      return res.status(400).json({ err })
    }

    return res.json({
      avatarExists
    })
  }
}