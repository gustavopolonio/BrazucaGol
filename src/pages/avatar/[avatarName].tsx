import { GetServerSideProps } from 'next'
import { fauna } from '../../services/faunadb'
import { query as q } from 'faunadb'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { PlayerLevelAndGoals } from '../../components/PlayerLevelAndGoals'
import * as Dialog from '@radix-ui/react-dialog'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { ActivateAvatarPopover } from '../../components/ActivateAvatarPopover'
import { useSession } from 'next-auth/react'

import { IoMdClose } from 'react-icons/io'
import {
  BsFire,
  BsFill3SquareFill,
  BsFill2SquareFill,
  BsFill9SquareFill,
} from 'react-icons/bs'

import {
  AiFillStar,
  AiFillTrophy,
  AiTwotoneQuestionCircle,
  AiFillTrademarkCircle,
} from 'react-icons/ai'

import styles from './styles.module.scss'

import { Club } from '../../@types/index'

interface Avatar {
  data: {
    name: string
    clubId: number
    userId: object
  }
}

interface IndividualGoals {
  data: {
    userId: object
    avatarAutoGoals: number
    avatarPenaltyGoals: number
    avatarFreeKickGoals: number
    avatarTrailGoals: number
  }
}

interface AvatarNameProps {
  avatar: {
    name: string
    clubId: number
    avatarAutoGoals: number
    avatarPenaltyGoals: number
    avatarFreeKickGoals: number
    avatarTrailGoals: number
    avatarHourlyGoals: number
    avatarRoundGoals: number
  }
  clubs: Club[]
}

const sendPrivateMessageFormSchema = z.object({
  privateMessage: z.string().max(250, { message: 'Max. 250 caracteres' }),
})

type SendMessage = z.infer<typeof sendPrivateMessageFormSchema>

export default function AvatarName({ avatar, clubs }: AvatarNameProps) {
  const [avatarClub, setAvatarClub] = useState<Club>()
  const refAvatarContainer = useRef(null)
  const { data: session } = useSession()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SendMessage>({
    resolver: zodResolver(sendPrivateMessageFormSchema),
  })

  const watchPrivateMessage = watch('privateMessage', '')
  const charactersRemaining =
    watchPrivateMessage.length > 250 ? 0 : 250 - watchPrivateMessage.length

  useEffect(() => {
    refAvatarContainer.current?.scrollIntoView({ behavior: 'smooth' })
  }, [avatar.name])

  useEffect(() => {
    const clubAux = clubs?.find((club) => club.id === avatar.clubId)
    setAvatarClub(clubAux)
  }, [avatar.clubId, clubs])

  const avatarTotalGoals =
    avatar.avatarAutoGoals +
    avatar.avatarPenaltyGoals +
    avatar.avatarFreeKickGoals +
    avatar.avatarTrailGoals

  async function handleSendPrivateMessage(data: SendMessage) {
    if (data.privateMessage.length === 0) return

    console.log(isSubmitting)
    // Fazer req enviar mensagem
  }

  return (
    <>
      <Head>
        <title>{avatar.name} | Brazucagol</title>
      </Head>

      <div ref={refAvatarContainer} className={styles.avatarContainer}>
        <h2 className={styles.avatarName}>{avatar.name}</h2>

        <div className={styles.avatarContent}>
          <div className={styles.leftSide}>
            <div className={styles.clubContainer}>
              {avatarClub ? (
                <>
                  <Image
                    src={avatarClub.logoLink}
                    alt={`Logo ${avatarClub.name}`}
                    width={108}
                    height={150}
                  />
                  <strong>{avatarClub.name}</strong>
                </>
              ) : (
                <LoadingSpinner
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                />
              )}
            </div>

            <div className={styles.divisionContainer}>
              <h3>Divisão</h3>
              <strong>6ª</strong>
            </div>

            <div className={styles.titlesContainer}>
              <h3>Títulos</h3>

              <ul>
                <li>
                  <AiFillStar size={28} color="#e1e14c" />
                  <strong>11</strong>
                </li>
                <li>
                  <AiFillTrophy size={28} color="#aeaeae" />
                  <strong>7</strong>
                </li>
                <li>
                  <AiTwotoneQuestionCircle size={28} color="5555d5" />
                  <strong>5</strong>
                </li>
                <li>
                  <AiFillTrademarkCircle size={28} />
                  <strong>2</strong>
                </li>
              </ul>
            </div>

            <div className={styles.isAvatarLoggedIn}>
              <div className={styles.loginStatus}></div>
              <strong className={styles.online}>Online</strong>
            </div>
          </div>

          <div className={styles.avatarImgContainer}>
            <Image
              src="/assets/avatarImage.png"
              alt=""
              width={210}
              height={480}
            />
          </div>

          <div className={styles.rightSide}>
            <PlayerLevelAndGoals
              totalGoals={avatarTotalGoals}
              roundGoals={avatar.avatarRoundGoals}
              hourlyGoals={avatar.avatarHourlyGoals}
            />

            <strong className={styles.vipActive}>Vip ativo</strong>

            <table className={styles.registerContainer}>
              <tbody>
                <tr>
                  <td>Cadastro</td>
                  <td>21/06/2023</td>
                </tr>
                <tr>
                  <td>Última entrada</td>
                  <td>25/06/2023</td>
                </tr>
                <tr>
                  <td>Trocas temporada</td>
                  <td>1/3</td>
                </tr>
              </tbody>
            </table>

            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button className={styles.historyButton}>Histórico</button>
              </Dialog.Trigger>

              <Dialog.Portal>
                <Dialog.Overlay className={styles.modalOverlay} />
                <Dialog.Content className={styles.modalContent}>
                  <Dialog.Title>Conquistas de {avatar.name}</Dialog.Title>
                  <ul className={styles.historyContainer}>
                    <li>
                      <BsFill3SquareFill size={28} color="#c3c305" />
                      <span>TOP 10 4&#170; Temporada &#40; 3° Lugar &#41;</span>
                    </li>
                    <li>
                      <BsFire size={28} color="blue" />
                      <span>1° Lendário Nível 2</span>
                    </li>
                    <li>
                      <BsFill2SquareFill size={28} color="#c3c305" />
                      <span>TOP 10 3&#170; Temporada &#40; 2° Lugar &#41;</span>
                    </li>
                    <li>
                      <BsFill9SquareFill size={28} color="#c3c305" />
                      <span>TOP 10 2&#170; Temporada &#40; 9° Lugar &#41;</span>
                    </li>
                    <li>
                      <BsFill3SquareFill size={28} color="#c3c305" />
                      <span>TOP 10 1&#170; Temporada &#40; 3° Lugar &#41;</span>
                    </li>

                    {/* <span>Nenhuma conquista</span> */}
                  </ul>
                  <Dialog.Close className={styles.closeModalButton}>
                    <IoMdClose size={28} />
                  </Dialog.Close>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>

        <p className={styles.avatarDescriptionContainer}>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tenetur
          maxime nostrum doloremque excepturi, minima inventore sint. Tempora,
          eaque eum. Voluptatibus eligendi odio voluptatem consequuntur iste
          earum saepe distinctio error harum!
        </p>

        {session?.isAvatarActive && (
          <form
            onSubmit={handleSubmit(handleSendPrivateMessage)}
            className={styles.sendPrivateMessageForm}
          >
            <label>
              <textarea
                {...register('privateMessage')}
                rows={4}
                placeholder={`Escreva aqui sua mensagem para ${avatar.name}`}
              ></textarea>
              {errors.privateMessage && (
                <span>{errors.privateMessage.message}</span>
              )}
            </label>

            <span>{charactersRemaining} N° restante</span>
            <button type="submit">
              Enviar
              {isSubmitting && (
                <LoadingSpinner
                  right="2%"
                  top="50%"
                  transform="translateY(-50%)"
                />
              )}
            </button>
          </form>
        )}
      </div>

      {session?.isAvatarActive === false && <ActivateAvatarPopover />}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const avatarName = params.avatarName

  try {
    const avatarData = await fauna.query<Avatar>(
      q.Get(q.Match(q.Index('avatar_by_name'), avatarName)),
    )

    const userId = avatarData.data.userId

    const avatarGoals = await fauna.query<IndividualGoals>(
      q.Get(q.Match(q.Index('individualGoals_by_userId'), userId)),
    )

    delete avatarData.data.userId
    delete avatarGoals.data.userId

    const avatar = {
      ...avatarData.data,
      ...avatarGoals.data,
    }

    return {
      props: { avatar },
    }
  } catch (error) {
    // Avatar not exists
    console.log(error)

    return {
      redirect: {
        destination: '/error/avatar-not-found',
        permanent: false,
      },
    }
  }
}
