import { NextApiRequest, NextApiResponse } from 'next'
import { query as q } from 'faunadb'
import { fauna } from '../../services/faunadb'

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

  if (req.method === 'POST') {

  }

  return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
}