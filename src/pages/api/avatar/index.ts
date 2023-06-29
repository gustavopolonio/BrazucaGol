import { NextApiRequest, NextApiResponse } from 'next'
import { query as q } from 'faunadb'
import { fauna } from '../../../services/faunadb'
import { getServerSession } from 'next-auth'
import { buildNextAuthOption } from '../auth/[...nextauth]'

interface AvatarQueryResponse {
  data: {
    name: string
    clubId: number
    userId: object
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

    // const userRef = await fauna.query(
    //   q.Select(
    //     'ref',
    //     q.Get(q.Match(q.Index('user_by_email'), session.user.email)),
    //   ),
    // )

    return fauna
      .query<AvatarQueryResponse>(
        q.Get(
          q.Match(
            q.Index('avatar_by_userId'),
            q.Ref(q.Collection('users'), session.user.documentIdFauna),
          ),
        ),
      )
      .then((response) => {
        return res.status(200).json({
          data: response,
        })
      })
      .catch((err) => {
        return res.status(400).json({ err })
      })
  }

  if (req.method === 'POST') {
    const { avatarName, avatarClub } = req.body
    const { user } = await getServerSession(
      req,
      res,
      buildNextAuthOption(req, res),
    )

    // search user_by_email and catch its Ref (this is my userId in avatars Collection)
    // const userRef = await fauna.query(
    //   q.Select('ref', q.Get(q.Match(q.Index('user_by_email'), user.email))),
    // )

    const userRef = await fauna.query(
      q.Ref(q.Collection('users'), user.documentIdFauna),
    )

    try {
      // Create avatar document
      await fauna.query(
        q.If(
          q.Not(q.Exists(q.Match(q.Index('avatar_by_name'), avatarName))),
          q.Create(q.Collection('avatars'), {
            data: {
              name: avatarName,
              clubId: avatarClub,
              userId: userRef,
            },
          }),
          true,
        ),
      )

      // Change the isAvatarActive to True
      await fauna.query(
        q.Update(userRef, {
          data: {
            isAvatarActive: true,
          },
        }),
      )

      // Create individualGoals document
      await fauna.query(
        q.If(
          q.Not(
            q.Exists(q.Match(q.Index('individualGoals_by_userId'), userRef)),
          ),
          q.Create(q.Collection('individualGoals'), {
            data: {
              userId: userRef,
              avatarAutoGoals: 0,
              avatarPenaltyGoals: 0,
              avatarFreeKickGoals: 0,
              avatarTrailGoals: 0,
              avatarHourlyGoals: 0,
              avatarRoundGoals: 0,
            },
          }),
          false,
        ),
      )

      return res.status(201).json({ success: true })
    } catch (err) {
      return res
        .status(501)
        .json({ error: `Sorry something happened! ${err.message}` })
    }
  }

  return res.status(405).json({ err: `Method ${req.method} Not Allowed` })
}
