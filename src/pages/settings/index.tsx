import Head from 'next/head'
import { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { getServerSession } from 'next-auth'
import { buildNextAuthOption } from '../api/auth/[...nextauth]'
import { getUserPreferences } from '../api/user-preferences'
import { api } from '../../services/api'
import { useUserPreferences } from '../../contexts/UserPreferencesContext'
import { useState } from 'react'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { signOut } from 'next-auth/react'

import styles from './styles.module.scss'

const updateUserPreferencesFormSchema = z.object({
  goalAlert: z.boolean(),
  kickIsReadyAlert: z.boolean(),
})

type UpdateFormData = z.infer<typeof updateUserPreferencesFormSchema>

interface UserPreferences {
  userPreferences: {
    kickAlert: boolean
    goalSound: boolean
  }
}

export default function Settings({ userPreferences }: UserPreferences) {
  const [displayUpdateMessage, setDisplayUpdateMessage] = useState(false)
  const { updateUserPreferences } = useUserPreferences()

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm<UpdateFormData>({
    defaultValues: {
      goalAlert: userPreferences.goalSound,
      kickIsReadyAlert: userPreferences.kickAlert,
    },
    resolver: zodResolver(updateUserPreferencesFormSchema),
  })

  async function handleUpdateUserPreferences(data: UpdateFormData) {
    const response = await api.post('/api/user-preferences', data)

    if (response.status === 201) {
      updateUserPreferences({
        goalSound: data.goalAlert,
        kickAlert: data.kickIsReadyAlert,
      })
    }

    setDisplayUpdateMessage(true)
    setTimeout(() => setDisplayUpdateMessage(false), 2500)
  }

  async function handleDeleteAccount() {
    const response = await api.delete('/api/user')
    if (response.status === 200) {
      signOut({ callbackUrl: '/' })
    }
  }

  return (
    <>
      <Head>
        <title>Configurações | Brazucagol</title>
      </Head>

      <div className={styles.settingsContainer}>
        <h1>Configurações</h1>

        <form
          className={styles.formSettings}
          onSubmit={handleSubmit(handleUpdateUserPreferences)}
        >
          <div className={styles.checkboxContainer}>
            <label htmlFor="goalAlertCheckbox">Alerta ao marcar gol</label>
            <input
              id="goalAlertCheckbox"
              type="checkbox"
              {...register('goalAlert')}
            />
          </div>

          <div className={styles.checkboxContainer}>
            <label htmlFor="kickIsReadyAlertCheckbox">
              Alerta chute está pronto
            </label>
            <input
              id="kickIsReadyAlertCheckbox"
              type="checkbox"
              {...register('kickIsReadyAlert')}
            />
          </div>

          {isSubmitting ? (
            <button type="submit" disabled style={{ cursor: 'not-allowed' }}>
              Salvar alterações
              <LoadingSpinner
                left="106%"
                top="50%"
                transform="translateY(-50%)"
              />
            </button>
          ) : (
            <button type="submit">Salvar alterações</button>
          )}

          {displayUpdateMessage ? (
            <strong className={styles.updateMessage}>
              Alterações salvas com sucesso!
            </strong>
          ) : (
            <strong className={styles.updateMessage}></strong>
          )}
        </form>

        <AlertDialog.Root>
          <AlertDialog.Trigger asChild>
            <button className={styles.deleteAccountButton}>
              Deletar conta
            </button>
          </AlertDialog.Trigger>

          <AlertDialog.Portal>
            <AlertDialog.Overlay className={styles.AlertDialogOverlay} />
            <AlertDialog.Content className={styles.AlertDialogContent}>
              <AlertDialog.Title className={styles.AlertDialogTitle}>
                Você tem certeza?
              </AlertDialog.Title>
              <AlertDialog.Description
                className={styles.AlertDialogDescription}
              >
                Essa ação não pode ser desfeita. Você deletará permanentemente
                sua conta e removerá seus dados dos nossos servidores.
              </AlertDialog.Description>
              <div className={styles.AlterDialogButtonsContainer}>
                <AlertDialog.Cancel
                  className={`${styles.DialogButton} ${styles.DialogCancelButton}`}
                  asChild
                >
                  <button>Cancelar</button>
                </AlertDialog.Cancel>
                {/* <AlertDialog.Action
                  className={`${styles.DialogButton} ${styles.DialogDeleteButton}`}
                  onClick={handleDeleteAccount}
                  asChild
                > */}
                <button
                  className={`${styles.DialogButton} ${styles.DialogDeleteButton}`}
                  onClick={handleDeleteAccount}
                >
                  Sim, deletar conta
                </button>
                {/* </AlertDialog.Action> */}
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
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

  if (session?.isAvatarActive === false || !session) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    }
  }

  try {
    const userPreferences = await getUserPreferences(session)

    return {
      props: { userPreferences },
    }
  } catch (err) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    }
  }
}
