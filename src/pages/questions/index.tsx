import Head from 'next/head'
import * as Accordion from '@radix-ui/react-accordion'
import React, { ReactNode, forwardRef } from 'react'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { ActivateAvatarPopover } from '../../components/ActivateAvatarPopover'
import { useSession } from 'next-auth/react'

import styles from './styles.module.scss'

interface AccordionChildrenProps {
  children: ReactNode
}

export default function Questions() {
  const { data: session } = useSession()

  return (
    <>
      <Head>
        <title>Dúvidas | Brazucagol</title>
      </Head>

      <div className={styles.questionsContainer}>
        <h2>Dúvidas frequentes</h2>

        <Accordion.Root type="multiple" className={styles.AccordionRoot}>
          <Accordion.Item value="item-1" className={styles.AccordionItem}>
            <AccordionTrigger>
              Quais caracteres posso colocar no nome do meu jogador?
            </AccordionTrigger>
            <AccordionContent>
              O nome do seu jogador deve ter entre 3 e 20 caracteres, sendo
              permitidos: letras minúsculas e maiúsculas, números, hífens (-),
              underlines (_) e colchetes ([]).
            </AccordionContent>
          </Accordion.Item>

          <Accordion.Item value="item-2" className={styles.AccordionItem}>
            <AccordionTrigger>Pergunta aqui?</AccordionTrigger>
            <AccordionContent>Resposta aqui dentro.</AccordionContent>
          </Accordion.Item>

          <Accordion.Item value="item-3" className={styles.AccordionItem}>
            <AccordionTrigger>Pergunta aqui?</AccordionTrigger>
            <AccordionContent>Resposta aqui dentro.</AccordionContent>
          </Accordion.Item>
        </Accordion.Root>
      </div>

      {session?.isAvatarActive === false && <ActivateAvatarPopover />}
    </>
  )
}

const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionChildrenProps>(
  ({ children, ...props }, forwardRef) => (
    <Accordion.Header className={styles.AccordionHeader}>
      <Accordion.Trigger
        className={styles.AccordionTrigger}
        ref={forwardRef}
        {...props}
      >
        {children}
        <ChevronDownIcon className={styles.AccordionChevron} aria-hidden />
      </Accordion.Trigger>
    </Accordion.Header>
  ),
)
AccordionTrigger.displayName = 'AccordionTrigger'

const AccordionContent = forwardRef<HTMLDivElement, AccordionChildrenProps>(
  ({ children, ...props }, forwardRef) => (
    <Accordion.Content
      className={styles.AccordionContent}
      ref={forwardRef}
      {...props}
    >
      <div className={styles.AccordionContentText}>{children}</div>
    </Accordion.Content>
  ),
)
AccordionContent.displayName = 'AccordionContent'
