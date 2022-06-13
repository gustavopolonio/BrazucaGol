import { getSession } from 'next-auth/react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { query as q } from 'faunadb'
import { fauna } from '../services/faunadb'
import { IoMdRefresh } from 'react-icons/io'
import { api } from '../services/api'

import styles from './create-avatar.module.scss'

interface Club {
  id: number,
  name: string,
  encodedName: string,
  logoLink: string,
  stadiumName: string,
  state: string
}

interface CreateAvatarData {
  avatarClub: string;
  avatarName: string
}

function compare( a: Club, b: Club ) {
  if ( a.name < b.name ){
    return -1;
  }
  if ( a.name > b.name ){
    return 1;
  }
  return 0;
}

export default function CreateAvatar() {
  const [clubs, setClubs] = useState<Club[]>([])
  const { register, handleSubmit, formState: { errors }, watch } = useForm()

  useEffect(() => {
    fetch('https://api-brazilian-soccer-clubs.herokuapp.com')
      .then(response => response.json())
      .then(data => setClubs(data.sort(compare)))
  }, [])

  async function checkAvatarName() {
    const avatarName = watch('avatarName')
    const { data } = await api.get('/api/avatars', {
      params: {
        avatarName
      }
    })

    // console.log('avatarExists', data.avatarExists)

    return data.avatarExists
  }

  async function onSubmit(data: CreateAvatarData): Promise<void> {
    console.log('data', data)
    // Check if avatarName  is available (faunadb)

    // if is available: create avatar in fauna

  }

  return (
    <>
      <Head>
        <title>Cadastre-se | Brazucagol</title>
      </Head>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.createAvatarForm}>
        <label>
          Nome do jogador
          <div>
            <input 
              {...register('avatarName', {
                required: 'Campo obrigatório',
                minLength: {
                  value: 3,
                  message: 'Min 3 caracteres'
                },
                validate: {
                  avatarExists: async () => await checkAvatarName() || 'error'
                }
              })}
            />
            <button type="button" onClick={() => checkAvatarName()}>
              <IoMdRefresh />
            </button>
          </div>
          { errors.avatarName ? (
            <span>{errors.avatarName.message}</span>
          ) : (
            <span></span>
          ) }
        </label>

        <label>
          Selecione seu time
          <select 
            {...register('avatarClub', {
              min: {
                value: 0,
                message: 'Selecione um time'
              }
            })}
          >
            <option value={-1}>------------</option>
            { clubs.map(club => (
              <option key={club.id} value={club.id}>{club.name}</option>
            )) }
          </select>
          { errors.avatarClub ? (
            <span>{errors.avatarClub.message}</span>
          ) : (
            <span></span>
          ) }
        </label>

        <button type='submit'>Criar Jogador</button>
      </form>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req })

  if (session?.isAvatarActive) {

    return {
      redirect: {
        permanent: false,
        destination: '/'
      }
    }
  }

  return {
    props: {}
  }
}