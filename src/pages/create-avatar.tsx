import { getSession } from 'next-auth/react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { IoMdRefresh } from 'react-icons/io'
import { BsCheckCircleFill } from 'react-icons/bs'
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
  const [nameExists, setNameExists] = useState(false)
  const [showCheckedIcon, setShowCheckedIcon] = useState(false)
  const { register, handleSubmit, formState: { errors }, watch, trigger } = useForm()

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

    const isInputNameValid = await trigger('avatarName')

    if (!data.avatarExists && isInputNameValid) {
      setShowCheckedIcon(true)
    } else {
      setNameExists(data.avatarExists)
    }
  }

  async function onSubmit(data: CreateAvatarData): Promise<void> {

    const response = await api.post('/api/avatars', {
      ...data,
      avatarClub: Number(data.avatarClub)
    })
    console.log(response)
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
                onChange: () => {setNameExists(false); setShowCheckedIcon(false)}
              })}
            />

            { showCheckedIcon && <BsCheckCircleFill style={{position: 'absolute', right: '42px', color: 'green'}} /> }
            
            <button type="button" onClick={() => checkAvatarName()}>
              <IoMdRefresh />
              <div className={styles.messageHolder}>
                <p>Clique aqui para checar se esse nome está disponível</p>
              </div>
            </button>
          </div>
          { nameExists ? (
            <span>Esse nome já está em uso</span>
          ) : errors.avatarName ? (
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