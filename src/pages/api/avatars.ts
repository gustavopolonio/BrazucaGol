import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
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
    const { avatarName, avatarClub } = req.body
    const { user } = await getSession({ req })
    
    // search user_by_email and catch its Ref (this is my userId in avatars Collection)
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

    try {
      await fauna.query(
        q.If(
          q.Not(
            q.Exists(
              q.Match(
                q.Index('avatar_by_name'),
                avatarName
              )
            )
          ),
          q.Create(
            q.Collection('avatars'),
            { 
              data: {
                name: avatarName,
                clubId: avatarClub,
                userId: userRef
              } 
            }
          ),
          true
        )
      )

      // Change the isAvatarActive to True
      await fauna.query(
        q.Update(
          userRef,
          {
            data: {
              isAvatarActive: true
            }
          }
        )
      )

      // Create individualGoals table
      await fauna.query(
        q.If(
          q.Not(
            q.Exists(
              q.Match(
                q.Index("individualGoals_by_userId"),
                userRef
              )
            )
          ),
          q.Create(
            q.Collection("individualGoals"),
            { 
              data: {
                userId: userRef,
                avatarAutoGoals: 0,
                avatarPenaltyGoals: 0,
                avatarFreeKickGoals: 0,
                avatarTrailGoals: 0,
                avatarHourlyGoals: 0,
                avatarRoundGoals: 0
              }
            }
          ),
          false
        )
      )
  
      return res.status(201).json({ success: true })
    } catch(err) {
      return res.status(501).json({ error: `Sorry something happened! ${err.message}` })
    }

  }

  return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
}