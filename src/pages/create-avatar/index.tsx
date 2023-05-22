import { getServerSession } from 'next-auth/next'
import { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IoMdRefresh } from 'react-icons/io'
import { BsCheckCircleFill } from 'react-icons/bs'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { api } from '../../services/api'
import { buildNextAuthOption } from '../api/auth/[...nextauth]'
import z from 'zod'
import { destroyCookie } from 'nookies'

import styles from './styles.module.scss'

interface Club {
  id: number
  name: string
  encodedName: string
  logoLink: string
  stadiumName: string
  state: string
}

function compare(a: Club, b: Club) {
  if (a.name < b.name) {
    return -1
  }
  if (a.name > b.name) {
    return 1
  }
  return 0
}

const createAvatarFormSchema = z.object({
  avatarName: z.string().min(3, { message: 'Mínimo 3 caracteres' }),
  avatarClub: z.coerce.number().min(0, { message: 'Escolha seu time!' }),
})

type CreateFormData = z.infer<typeof createAvatarFormSchema>

export default function CreateAvatar() {
  const [clubs, setClubs] = useState<Club[]>([])
  const [nameExists, setNameExists] = useState(false)
  const [showCheckedIcon, setShowCheckedIcon] = useState(false)

  let nameIsAlreadyInUse = false

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    trigger,
  } = useForm<CreateFormData>({
    resolver: zodResolver(createAvatarFormSchema),
  })

  useEffect(() => {
    fetch('https://api-brazilian-soccer-clubs.cyclic.app/')
      .then((response) => response.json())
      .then((data) => setClubs(data.sort(compare)))
  }, [])

  async function checkAvatarName() {
    const avatarName = watch('avatarName')
    const { data } = await api.get(`/api/avatar/${avatarName}`)

    const isInputNameValid = await trigger('avatarName')

    if (!data.avatarExists && isInputNameValid) {
      setShowCheckedIcon(true)
    } else {
      nameIsAlreadyInUse = data.avatarExists
      setNameExists(data.avatarExists)
    }
  }

  async function onSubmit(data: CreateFormData): Promise<void> {
    await checkAvatarName()
    if (nameIsAlreadyInUse) return

    const response = await api.post('/api/avatar', {
      ...data,
      avatarClub: data.avatarClub,
    })

    if (response.status === 201) {
      window.location.replace('/')
      destroyCookie(null, 'brazucagol:isAvatarActive')
    }
  }

  return (
    <>
      <Head>
        <title>Cadastre-se | Brazucagol</title>
      </Head>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.createAvatarForm}
      >
        <label>
          Nome do jogador
          <div>
            <input
              {...register('avatarName', {
                onChange: () => {
                  setNameExists(false)
                  setShowCheckedIcon(false)
                },
              })}
            />

            {showCheckedIcon && (
              <BsCheckCircleFill
                style={{
                  position: 'absolute',
                  right: '42px',
                  color: 'green',
                }}
              />
            )}

            <button type="button" onClick={() => checkAvatarName()}>
              <IoMdRefresh />
              <div className={styles.messageHolder}>
                <p>Clique aqui para checar se esse nome está disponível</p>
              </div>
            </button>
          </div>
          {nameExists ? (
            <span>Esse nome já está em uso</span>
          ) : errors.avatarName ? (
            <span>{errors.avatarName.message}</span>
          ) : (
            <span></span>
          )}
        </label>

        <label>
          Selecione seu time
          <select {...register('avatarClub')}>
            <option value={-1}>------------</option>
            {clubs.map((club) => (
              <option key={club.id} value={club.id}>
                {club.name}
              </option>
            ))}
          </select>
          {errors.avatarClub ? (
            <span>{errors.avatarClub.message}</span>
          ) : (
            <span></span>
          )}
        </label>

        {isSubmitting ? (
          <button type="submit" disabled style={{ cursor: 'not-allowed' }}>
            Criar Jogador
            <LoadingSpinner
              left="106%"
              top="50%"
              transform="translateY(-50%)"
            />
          </button>
        ) : (
          <button type="submit">Criar Jogador</button>
        )}
      </form>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOption(req as NextApiRequest, res as NextApiResponse),
  )

  if (session?.isAvatarActive) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    }
  }

  return {
    props: {},
  }
}
