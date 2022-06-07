import { getSession } from 'next-auth/react'
import { useEffect, useState, FormEvent } from 'react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useForm } from 'react-hook-form'

import styles from './create-avatar.module.scss'

interface Club {
  id: number,
  name: string,
  encodedName: string,
  logoLink: string,
  stadiumName: string,
  state: string
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
  // const [playerName, setPlayerName] = useState('')
  // const [playerClub, setPlayerClub] = useState(-1)
  const { register, handleSubmit, formState: { errors } } = useForm()

  useEffect(() => {
    fetch('https://api-brazilian-soccer-clubs.herokuapp.com')
      .then(response => response.json())
      .then(data => setClubs(data.sort(compare)))
  }, [])

  function onSubmit2(data) {
    console.log('data', data)
  }

  return (
    <>
      <Head>
        <title>Cadastre-se | Brazucagol</title>
      </Head>

      <form onSubmit={handleSubmit(onSubmit2)} className={styles.createAvatarForm}>
        <label>
          Nome do jogador
          <input 
            {...register('playerName', {
              required: {
                value: true,
                message: 'Campo obrigatorio'
              },
              minLength: {
                value: 3,
                message: 'Min 3 caracteres'
              }
            })}
          />
          { errors.playerName && errors.playerName.message }
        </label>

        <label>
          Selecione seu time
          <select 
            {...register('playerClub')}
          >
            <option value={-1}>------------</option>
            { clubs.map(club => (
              <option key={club.id} value={club.id}>{club.name}</option>
            )) }
          </select>
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