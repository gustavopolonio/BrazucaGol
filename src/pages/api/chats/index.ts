import { NextApiRequest, NextApiResponse } from 'next'
import { query as q } from 'faunadb'
import { fauna } from '../../../services/faunadb'
import { getServerSession } from 'next-auth'
import { buildNextAuthOption } from '../auth/[...nextauth]'

interface RequestBody {
  privateMessage: string
  secondaryUserId: string
  secondaryUserName: string
  senderUserName: string
  chatAlreadyExists?: boolean
  chatAlreadyExistsCombinedId?: string
}

async function checkIfAlreadyExistsUnreadMessage(
  secondaryUserId: string,
  combinedId: string,
) {
  // Checar se já tem mensagem não lida no user que recebeu a mensagem
  await fauna.query(
    q.Let(
      {
        ref: q.Select(
          'ref',
          q.Get(q.Match(q.Index('userChats_by_userId'), secondaryUserId)),
        ),
        doc: q.Get(q.Var('ref')),
        unreadChats: q.Select(['data', 'unreadChats'], q.Var('doc')),
      },
      q.If(
        q.IsEmpty(
          q.Filter(
            q.Var('unreadChats'),
            q.Lambda(
              'chatCombinedId',
              q.Equals(q.Var('chatCombinedId'), combinedId),
            ),
          ),
        ),
        // Não tem msg não lida: adicionar combinedId no array
        q.Update(q.Var('ref'), {
          data: {
            unreadChats: q.Append(combinedId, q.Var('unreadChats')),
          },
        }),
        true, // Já tem msg não lida: não fazer nada
      ),
    ),
  )
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method === 'GET') {
    const { combinedId } = req.query

    try {
      const chatHistory = await fauna.query(
        q.Reverse(
          q.Select(
            ['data', 'messages'],
            q.Get(q.Match(q.Index('chats_by_combinedId'), combinedId)),
          ),
        ),
      )

      return res.status(200).json(chatHistory)
    } catch (error) {
      return res.status(400).json({ error })
    }
  }

  if (req.method === 'POST') {
    const {
      privateMessage,
      secondaryUserId,
      secondaryUserName,
      senderUserName,
      chatAlreadyExists,
      chatAlreadyExistsCombinedId,
    }: RequestBody = req.body

    const { user } = await getServerSession(
      req,
      res,
      buildNextAuthOption(req, res),
    )

    if (chatAlreadyExists) {
      // Só preciso atualizar a última msg do chat geral

      try {
        await fauna.query(
          q.Do(
            q.Let(
              {
                ref: q.Select(
                  'ref',
                  q.Get(
                    q.Match(
                      q.Index('chats_by_combinedId'),
                      chatAlreadyExistsCombinedId,
                    ),
                  ),
                ),
                doc: q.Get(q.Var('ref')),
                messages: q.Select(['data', 'messages'], q.Var('doc')),
              },
              q.Update(q.Var('ref'), {
                data: {
                  messages: q.Prepend(
                    // Mensagens mais recentes ficam em 1o no DB (prepend)
                    {
                      // sentAt: q.Now(),
                      sentAt: Date.now(),
                      senderId: user.id,
                      text: privateMessage,
                    },
                    q.Var('messages'),
                  ),
                },
              }),
            ),

            checkIfAlreadyExistsUnreadMessage(
              secondaryUserId,
              chatAlreadyExistsCombinedId,
            ),
          ),
        )

        return res.status(201).json({ success: true, senderId: user.id })
      } catch (error) {
        console.log(error)
      }
    }

    const combinedId =
      Number(user.id) >= Number(secondaryUserId)
        ? secondaryUserId + user.id
        : user.id + secondaryUserId

    try {
      await fauna.query(
        q.If(
          q.Not(q.Exists(q.Match(q.Index('chats_by_combinedId'), combinedId))),
          // Não existe chat entre esses users, criar para os 2:

          q.Do(
            // Criando chat geral da conversa
            q.Create(q.Collection('chats'), {
              data: {
                combinedId,
                messages: [
                  {
                    // sentAt: q.Now(),
                    sentAt: Date.now(),
                    senderId: user.id,
                    text: privateMessage,
                  },
                ],
              },
            }),

            // Criando userChat para user que enviou a msg
            q.Let(
              {
                ref: q.Select(
                  'ref',
                  q.Get(q.Match(q.Index('userChats_by_userId'), user.id)),
                ),
                doc: q.Get(q.Var('ref')),
                chats: q.Select(['data', 'chats'], q.Var('doc')),
              },
              q.Update(q.Var('ref'), {
                data: {
                  chats: q.Append(
                    {
                      combinedId,
                      // lastMessage: {
                      //   text: privateMessage,
                      //   senderId: user.id,
                      //   wasRead: false,
                      //   sentAt: q.Now(),
                      // },
                      secondaryUser: {
                        id: secondaryUserId,
                        name: secondaryUserName,
                        // avatarPhoto:
                      },
                    },
                    q.Var('chats'),
                  ),
                },
              }),
            ),

            // Criando userChat para user que recebeu a msg
            q.Let(
              {
                ref: q.Select(
                  'ref',
                  q.Get(
                    q.Match(q.Index('userChats_by_userId'), secondaryUserId),
                  ),
                ),
                doc: q.Get(q.Var('ref')),
                chats: q.Select(['data', 'chats'], q.Var('doc')),
              },
              q.Update(q.Var('ref'), {
                data: {
                  chats: q.Append(
                    {
                      combinedId,
                      // lastMessage: {
                      //   text: privateMessage,
                      //   senderId: user.id,
                      //   wasRead: false,
                      //   sentAt: q.Now(),
                      // },
                      secondaryUser: {
                        id: user.id,
                        name: senderUserName,
                        // avatarPhoto:
                      },
                    },
                    q.Var('chats'),
                  ),
                },
              }),
            ),

            checkIfAlreadyExistsUnreadMessage(secondaryUserId, combinedId),
          ),

          // Já existe chat entre esses users, atualizar com a nova msg
          q.Do(
            // Atualizando o chat geral
            q.Let(
              {
                ref: q.Select(
                  'ref',
                  q.Get(q.Match(q.Index('chats_by_combinedId'), combinedId)),
                ),
                doc: q.Get(q.Var('ref')),
                messages: q.Select(['data', 'messages'], q.Var('doc')),
              },
              q.Update(q.Var('ref'), {
                data: {
                  messages: q.Prepend(
                    // Mensagens mais recentes ficam em 1o no DB (prepend)
                    {
                      // sentAt: q.Now(),
                      sentAt: Date.now(),
                      senderId: user.id,
                      text: privateMessage,
                    },
                    q.Var('messages'),
                  ),
                },
              }),
            ),

            checkIfAlreadyExistsUnreadMessage(secondaryUserId, combinedId),
          ),
        ),
      )

      return res.status(201).json({ success: true })
    } catch (error) {
      console.log(error)
    }
  }

  return res.status(405).json({ err: `Method ${req.method} Not Allowed` })
}
