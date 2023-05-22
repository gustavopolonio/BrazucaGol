import Head from 'next/head'
import * as Checkbox from '@radix-ui/react-checkbox'
import { CheckIcon } from '@radix-ui/react-icons'

import styles from './styles.module.scss'

export default function Settings() {
  return (
    <>
      <Head>
        <title>Configurações | Brazucagol</title>
      </Head>

      <div className={styles.settingsContainer}>
        <h1>Configurações</h1>

        <form className={styles.formSettings}>
          <div className={styles.checkboxContainer}>
            <label htmlFor="goalAlertCheckbox">Alerta ao marcar gol</label>
            <Checkbox.Root
              className={styles.checkboxRoot}
              id="goalAlertCheckbox"
            >
              <Checkbox.Indicator className={styles.checkboxIndicator}>
                <CheckIcon width={24} height={24} />
              </Checkbox.Indicator>
            </Checkbox.Root>
          </div>

          <div className={styles.checkboxContainer}>
            <label htmlFor="kickIsReadyAlertCheckbox">
              Alerta chute está pronto
            </label>
            <Checkbox.Root
              className={styles.checkboxRoot}
              id="kickIsReadyAlertCheckbox"
            >
              <Checkbox.Indicator className={styles.checkboxIndicator}>
                <CheckIcon width={24} height={24} />
              </Checkbox.Indicator>
            </Checkbox.Root>
          </div>

          <button type="submit">Salvar alterações</button>
        </form>

        <button style={{ marginTop: '10rem' }}>Deletar conta</button>
      </div>
    </>
  )
}

// Antes de acessar essa pág checar as settings do usuário
