import styles from './styles.module.scss'

interface LoadingSpinnerProps {
  top?: string;
  left?: string;
  transform?: string
}

export function LoadingSpinner({ top, left, transform }: LoadingSpinnerProps) {

  return (
    <div className={styles.spinnerContainer} style={{top, left, transform }}>
      <div className={styles.loadingSpinner}></div>
    </div>
  )
}