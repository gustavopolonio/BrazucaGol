import Head from 'next/head'
import { BsFillSendFill, BsFillTrashFill } from 'react-icons/bs'
import { FiRefreshCcw } from 'react-icons/fi'
import Image from 'next/image'
import * as Tooltip from '@radix-ui/react-tooltip'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import * as Dialog from '@radix-ui/react-dialog'
import { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOption } from '../api/auth/[...nextauth]'
import { fauna } from '../../services/faunadb'
import { query as q } from 'faunadb'
import { IoMdClose } from 'react-icons/io'
import { Fragment, useEffect, useRef, useState } from 'react'
import { api } from '../../services/api'
import z from 'zod'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { fromUnixTime, format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { Message } from '../../components/Message'
import { checkDateIsCurrentWeek } from '../../utils/checkDateIsCurrentWeek'

import styles from './styles.module.scss'

interface UserChats {
  combinedId: string
  secondaryUser: {
    id: string
    name: string
  }
  text: string
  senderId: string
  sentAt: number
}

interface UserChatsFormatted {
  combinedId: string
  secondaryUser: {
    id: string
    name: string
  }
  lastMessage: {
    text: string
    senderId: string
    sentAt: number
  }
}

interface MessagesProps {
  userChatsFormatted: UserChatsFormatted[]
}

interface ChatHistoryMessage {
  senderId: string
  sentAt: number
  text: string
  showDateOnChat?: boolean
}

const sendPrivateMessageFormSchema = z.object({
  privateMessage: z
    .string()
    .min(1, { message: 'Min. 1 caracter' })
    .max(250, { message: 'Max. 250 caracteres' }),
})

type SendMessage = z.infer<typeof sendPrivateMessageFormSchema>

export default function Messages({ userChatsFormatted }: MessagesProps) {
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false)
  const [chatHistory, setChatHistory] = useState<ChatHistoryMessage[]>([])
  const [replyMessage, setReplyMessage] = useState('')
  const [combinedId, setCombinedId] = useState('')
  const [isQueryingChatsHistory, setIsQueryingChatsHistory] = useState(false)
  const messageTextAreaRef = useRef<HTMLTextAreaElement>(null)

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SendMessage>({
    resolver: zodResolver(sendPrivateMessageFormSchema),
    defaultValues: {
      privateMessage: '',
    },
  })

  useEffect(() => {
    // Resize auto textarea height
    if (messageTextAreaRef.current) {
      messageTextAreaRef.current.style.height = '0px'
      const scrollHeight = messageTextAreaRef.current.scrollHeight

      messageTextAreaRef.current.style.height = scrollHeight + 'px'
    }
  }, [messageTextAreaRef, replyMessage])

  function showDatesOfMessagesOnChat(messages: ChatHistoryMessage[]) {
    const daysStored = {}

    setChatHistory(
      messages.map((chat: ChatHistoryMessage) => {
        const dateOfChatSentAt = format(
          fromUnixTime(chat.sentAt / 1000),
          'dd/MM/yyyy',
          {
            locale: ptBR,
          },
        )

        if (!daysStored[dateOfChatSentAt]) {
          daysStored[dateOfChatSentAt] = true

          return {
            ...chat,
            showDateOnChat: true,
          }
        } else {
          return chat
        }
      }),
    )
  }

  async function handleOpenReplyModal(combinedId: string) {
    setIsQueryingChatsHistory(true)
    setCombinedId(combinedId)

    const response = await api.get('/api/chats', {
      params: {
        combinedId,
      },
    })

    if (response.status === 200) {
      showDatesOfMessagesOnChat(response.data)

      setIsQueryingChatsHistory(false)
      setIsReplyModalOpen(true)
    }
  }

  async function handleSendPrivateMessage(dataForm: SendMessage) {
    const response = await api.post('/api/chats', {
      privateMessage: dataForm.privateMessage,
      chatAlreadyExists: true,
      chatAlreadyExistsCombinedId: combinedId,
    })

    if (response.status === 201) {
      reset()

      const newChatHistory = [
        ...chatHistory,
        {
          senderId: response.data.senderId,
          sentAt: Date.now(),
          text: dataForm.privateMessage,
        },
      ]

      showDatesOfMessagesOnChat(newChatHistory)

      messageTextAreaRef.current.style.height = '36px' // Resizing textarea height to 1 row
    }
  }

  function handleDeleteMessage() {}

  function scrollToBottomReplyModal(el: HTMLDivElement) {
    el?.scrollTo(0, el.scrollHeight)
  }

  return (
    <>
      <Head>
        <title>Mensagens | Brazucagol</title>
      </Head>

      <div className={styles.messagesContainer}>
        <header>
          <h2>Seus recados</h2>
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button>
                  <FiRefreshCcw size={24} />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className={styles.TooltipContent}
                  side="left"
                  sideOffset={5}
                >
                  Clique para checar se você tem novas mensagens
                  <Tooltip.Arrow
                    className={styles.TooltipArrow}
                    width={20}
                    height={10}
                  />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </header>

        {userChatsFormatted.length > 0 ? (
          <ul className={styles.messagesContent}>
            {userChatsFormatted.map((chat) => (
              <li className={styles.message} key={chat.combinedId}>
                <div className={styles.avatarInfos}>
                  <Image
                    src="/assets/avatarPhoto.png"
                    alt=""
                    width={100}
                    height={100}
                  />
                  <span>{chat.secondaryUser.name}</span>
                </div>

                <button
                  className={styles.textMessage}
                  onClick={() => handleOpenReplyModal(chat.combinedId)}
                  disabled={isQueryingChatsHistory}
                >
                  <p>{chat.lastMessage.text}</p>
                </button>

                <div className={styles.actionButtons}>
                  <Dialog.Root
                    open={isReplyModalOpen}
                    onOpenChange={setIsReplyModalOpen}
                  >
                    <button
                      className={styles.replyMessageButton}
                      onClick={() => handleOpenReplyModal(chat.combinedId)}
                      disabled={isQueryingChatsHistory}
                    >
                      Responder
                      <BsFillSendFill />
                      {isQueryingChatsHistory && (
                        <LoadingSpinner
                          left="108%"
                          top="50%"
                          transform="translateY(-50%)"
                        />
                      )}
                    </button>

                    <Dialog.Portal>
                      <Dialog.Overlay className={styles.modalOverlay} />
                      <Dialog.Content
                        ref={(el) => scrollToBottomReplyModal(el)}
                        className={styles.modalContent}
                      >
                        <div className={styles.replyModalHeader}>
                          <Dialog.Title>{chat.secondaryUser.name}</Dialog.Title>

                          <Dialog.Close className={styles.closeModalButton}>
                            <IoMdClose size={16} />
                          </Dialog.Close>
                        </div>

                        <ul className={styles.replyModalMessagesContainer}>
                          {chatHistory.map((message) =>
                            message.showDateOnChat ? (
                              <Fragment key={message.sentAt}>
                                <div className={styles.dateLong}>
                                  <span>
                                    {checkDateIsCurrentWeek(
                                      fromUnixTime(message.sentAt / 1000),
                                    )}
                                  </span>
                                </div>
                                <Message
                                  senderId={message.senderId}
                                  sentAt={message.sentAt}
                                  text={message.text}
                                />
                              </Fragment>
                            ) : (
                              <Message
                                key={message.sentAt}
                                senderId={message.senderId}
                                sentAt={message.sentAt}
                                text={message.text}
                              />
                            ),
                          )}
                        </ul>

                        <form
                          onSubmit={handleSubmit(handleSendPrivateMessage)}
                          className={styles.replyModalSendMessageForm}
                        >
                          <fieldset>
                            <label>
                              <Controller
                                control={control}
                                name="privateMessage"
                                render={({
                                  field: { onChange, value, ref },
                                }) => (
                                  <textarea
                                    rows={1}
                                    placeholder="Escreva sua mensagem"
                                    ref={(e) => {
                                      ref(e)
                                      messageTextAreaRef.current = e
                                    }}
                                    value={value}
                                    onChange={(e) => {
                                      onChange(e.target.value)
                                      setReplyMessage(e.target.value)
                                    }}
                                  ></textarea>
                                )}
                              />
                            </label>

                            {isSubmitting ? (
                              <LoadingSpinner position="unset" />
                            ) : (
                              <button type="submit">
                                <BsFillSendFill size={20} />
                              </button>
                            )}
                          </fieldset>

                          {errors.privateMessage && (
                            <span>{errors.privateMessage.message}</span>
                          )}
                        </form>
                      </Dialog.Content>
                    </Dialog.Portal>
                  </Dialog.Root>

                  <AlertDialog.Root>
                    <AlertDialog.Trigger asChild>
                      <button className={styles.deleteMessageButton}>
                        Deletar
                        <BsFillTrashFill />
                      </button>
                    </AlertDialog.Trigger>

                    <AlertDialog.Portal>
                      <AlertDialog.Overlay
                        className={styles.AlertDialogOverlay}
                      />
                      <AlertDialog.Content
                        className={styles.AlertDialogContent}
                      >
                        <AlertDialog.Title className={styles.AlertDialogTitle}>
                          Você tem certeza?
                        </AlertDialog.Title>
                        <AlertDialog.Description
                          className={styles.AlertDialogDescription}
                        >
                          Ao deletar uma mensagem você não poderá recuperá-la.
                        </AlertDialog.Description>
                        <div className={styles.AlterDialogButtonsContainer}>
                          <AlertDialog.Cancel
                            className={`${styles.DialogButton} ${styles.DialogCancelButton}`}
                            asChild
                          >
                            <button>Cancelar</button>
                          </AlertDialog.Cancel>
                          <AlertDialog.Action
                            className={`${styles.DialogButton} ${styles.DialogDeleteButton}`}
                            onClick={handleDeleteMessage}
                            asChild
                          >
                            <button
                            // className={`${styles.DialogButton} ${styles.DialogDeleteButton}`}
                            // onClick={handleDeleteMessage}
                            >
                              Sim, deletar mensagem
                            </button>
                          </AlertDialog.Action>
                        </div>
                      </AlertDialog.Content>
                    </AlertDialog.Portal>
                  </AlertDialog.Root>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <span className={styles.noMessageContent}>Nenhum recado :&#40;</span>
        )}
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOption(req as NextApiRequest, res as NextApiResponse),
  )

  try {
    const userChats = await fauna.query<UserChats[]>(
      q.Let(
        {
          userChats: q.Select(
            ['data', 'chats'],
            q.Get(q.Match(q.Index('userChats_by_userId'), session.user.id)),
          ),
        },
        q.Map(
          q.Var('userChats'),
          q.Lambda(
            'chat',
            q.Merge(
              q.Select(
                ['data', 'messages', 0],
                q.Get(
                  q.Match(
                    q.Index('chats_by_combinedId'),
                    q.Select('combinedId', q.Var('chat')),
                  ),
                ),
              ),
              q.Var('chat'),
            ),
          ),
        ),
      ),
    )

    const userChatsFormatted = userChats.map((chat) => {
      return {
        combinedId: chat.combinedId,
        secondaryUser: chat.secondaryUser,
        lastMessage: {
          text: chat.text,
          senderId: chat.senderId,
          sentAt: chat.sentAt,
        },
      }
    })

    return {
      props: { userChatsFormatted },
    }
  } catch (error) {
    console.log(error)

    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
}
