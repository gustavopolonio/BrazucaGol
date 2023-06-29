import Head from 'next/head'
import { BsFillSendFill, BsFillTrashFill } from 'react-icons/bs'
import { FiRefreshCcw } from 'react-icons/fi'
import Image from 'next/image'
import Link from 'next/link'
import * as Tooltip from '@radix-ui/react-tooltip'
import * as AlertDialog from '@radix-ui/react-alert-dialog'

import styles from './styles.module.scss'

export default function Messages() {
  // Msg lida e msg nova
  // Dia e hr e minuto a msg foi enviada

  // fç: Atualizar para ver se tem recado novo
  // Deletar com radix (criar componente page settings e messages)
  // Paragrafo é clicavel (abrir modal para exibir o histórico da conversa e ser possivel responder)

  function handleDeleteMessage() {}

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

        <ul className={styles.messagesContent}>
          <li className={styles.message}>
            <div className={styles.avatarInfos}>
              <Image
                src="/assets/avatarPhoto.png"
                alt=""
                width={100}
                height={100}
              />
              <span>Gustavinho111</span>
            </div>

            <Link href="">
              <p className={styles.textMessage}>
                ectetur adipisicing elit. Tenetur maxime nostrum doloremque
                excepturi, minima inventore sint. Tempora, eaque euectetur
                adipisicing elit. Tenetur maxime nostrum doloremque excepturi,
                minima inventore sint. Tempora, eaque etore sint. Tempora, eaque
                esa
              </p>
            </Link>

            <div className={styles.actionButtons}>
              <Link href="">
                Responder
                <BsFillSendFill />
              </Link>

              <AlertDialog.Root>
                <AlertDialog.Trigger asChild>
                  <button>
                    Deletar
                    <BsFillTrashFill />
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

          <li className={styles.message}>
            <div className={styles.avatarInfos}>
              <Image
                src="/assets/avatarPhoto.png"
                alt=""
                width={100}
                height={100}
              />
              <span>Gustavinho111</span>
            </div>

            <p className={styles.textMessage}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Laudantium dolores quaerat repellendus earum dolor doloribus
              expedita, dolorem ipsum consequatur delectus accusantium quibusdam
              iste tenetur suscipit est recusandae illum et pariatur.
            </p>

            <div className={styles.actionButtons}>
              <Link href="">
                Responder
                <BsFillSendFill />
              </Link>

              <button>
                Deletar
                <BsFillTrashFill />
              </button>
            </div>
          </li>

          <li className={styles.message}>
            <div className={styles.avatarInfos}>
              <Image
                src="/assets/avatarPhoto.png"
                alt=""
                width={100}
                height={100}
              />
              <span>Gustavinho111</span>
            </div>

            <p className={styles.textMessage}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Laudantium dolores quaerat repellendus earum dolor doloribus
              expedita, dolorem ipsum consequatur delectus accusantium quibusdam
              iste tenetur suscipit est recusandae illum et pariatur.
            </p>

            <div className={styles.actionButtons}>
              <Link href="">
                Responder
                <BsFillSendFill />
              </Link>

              <button>
                Deletar
                <BsFillTrashFill />
              </button>
            </div>
          </li>

          <li className={styles.message}>
            <div className={styles.avatarInfos}>
              <Image
                src="/assets/avatarPhoto.png"
                alt=""
                width={100}
                height={100}
              />
              <span>Gustavinho111</span>
            </div>

            <p className={styles.textMessage}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Laudantium dolores quaerat repellendus earum dolor doloribus
              expedita, dolorem ipsum consequatur delectus accusantium quibusdam
              iste tenetur suscipit est recusandae illum et pariatur.
            </p>

            <div className={styles.actionButtons}>
              <Link href="">
                Responder
                <BsFillSendFill />
              </Link>

              <button>
                Deletar
                <BsFillTrashFill />
              </button>
            </div>
          </li>

          <li className={styles.message}>
            <div className={styles.avatarInfos}>
              <Image
                src="/assets/avatarPhoto.png"
                alt=""
                width={100}
                height={100}
              />
              <span>Gustavinho111</span>
            </div>

            <p className={styles.textMessage}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Laudantium dolores quaerat repellendus earum dolor doloribus
              expedita, dolorem ipsum consequatur delectus accusantium quibusdam
              iste tenetur suscipit est recusandae illum et pariatur.
            </p>

            <div className={styles.actionButtons}>
              <Link href="">
                Responder
                <BsFillSendFill />
              </Link>

              <button>
                Deletar
                <BsFillTrashFill />
              </button>
            </div>
          </li>

          {/* <span>Nenhum recado :&#40;</span> */}
        </ul>
      </div>
    </>
  )
}
