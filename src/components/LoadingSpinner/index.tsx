import styles from './styles.module.scss'

interface LoadingSpinnerProps {
  top?: string
  left?: string
  right?: string
  transform?: string
  position?: 'unset' | 'absolute' | 'relative'
}

export function LoadingSpinner({
  top,
  left = 'unset',
  right = 'unset',
  transform,
  position,
}: LoadingSpinnerProps) {
  return (
    <div
      className={styles.spinnerContainer}
      style={{ top, left, right, transform, position }}
    >
      <div className={styles.loadingSpinner}></div>
    </div>
  )
}
