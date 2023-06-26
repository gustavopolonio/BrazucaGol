import styles from './styles.module.scss'

interface LoadingSpinnerProps {
  top?: string
  left?: string
  right?: string
  transform?: string
}

export function LoadingSpinner({
  top,
  left = 'unset',
  right = 'unset',
  transform,
}: LoadingSpinnerProps) {
  return (
    <div
      className={styles.spinnerContainer}
      style={{ top, left, right, transform }}
    >
      <div className={styles.loadingSpinner}></div>
    </div>
  )
}
