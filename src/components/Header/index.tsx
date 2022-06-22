import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { LoadingSpinner } from '../Utils/LoadingSpinner'
import { useAvatarData } from '../../contexts/AvatarDataContext'
import { useIndividualGoals } from '../../contexts/IndividualGoalsContext'

import styles from './styles.module.scss'

interface Club {
  id: number,
  name: string,
  encodedName: string,
  logoLink: string,
  stadiumName: string,
  state: string
}

export function Header() {
  const { data: session } = useSession()
  const [club, setClub] = useState<Club>()
  const avatarData = useAvatarData()
  const { totalGoals, hourlyGoals } = useIndividualGoals()

  useEffect(() => {
    fetch("https://api-brazilian-soccer-clubs.herokuapp.com/")
      .then(response => response.json())
      .then(data => setClub(data.find(club => club.id === avatarData?.clubId)))
  }, [avatarData])

  return (
    <header className={styles.header}>
      <h1 className={styles.logoContainer}>
        <span className={styles.bra}>BRA</span><br/>
        <span className={styles.zuca}>ZUCA</span><br/>
        <span className={styles.gol}>GOL</span>
      </h1>

      {session?.isAvatarActive && (
        <div className={styles.dataContainer}>
          <div className={styles.playerData}>
            <div className={styles.playerLevel}>
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAflBMVEX///8AAADz8/O/v79gYGA+Pj729vaWlpb7+/uFhYX19fXX19e8vLyzs7Pr6+vu7u6qqqrGxsYZGRni4uJ9fX2MjIzf399RUVHQ0NBzc3Ofn59PT09cXFwuLi5tbW2QkJAnJyd5eXmjo6MtLS0QEBA1NTVISEg8PDwdHR0VFRXe1dmxAAAHSElEQVR4nO2caXviOgyFJ+wUynbD0AKlQIF2/v8fvGwJieQktiInMzzn/QqxLcfLkeT41y8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgm06v7hb4ZbAIgtO07lZ4ZBhc+X6ruyG++B1ELJ7Uxp/gwWJQd2s8sAlSrJ7OxteAsn4uG/9jBl5s/F13sxTZmiwMgvdR3Q3T4t1s4PPYyCfhk9lonIQJduO6W1iWrwILgyBs1NvC8KNf5vHsSZig/6LVWgGtcwPa8seHNgZebKztPU6u9a+lj48sDbzY2NFst3MLQ+HzP7lGEeZ1jNVVVPtE9PjAxcAz3cp95MQsEvk8L44Wnm2seKwmB9l/kgJyd/u/4D2m2ydSH7ZraZKlth3ZEMUseoujxV9s45RWLPN3hjOBjXtlW8zw3h/KChoeBTbKVm8nxoZqpQJuujIUVsCfV1VzDOxN1R5Fk/HMaH5wtnEmHDO2nMzVzsUFTq1UeIqvpqJBlE5mtdLR87LMCGfkcfQXJmcr6YMfiY3Dtbt5V06+Qsjz3GrnTvNxPNzkllbAyo+N7YJqP7p222NnOv8otGH7mf8fH++xZ9G3P+EwV8o1BpOd1VZ47Fzec+5CpJ8KKAogxazCfXPQSOUGey+D5qRvP+8WcaWTVnU25iw0Zrbt02K9XpzaX64b3yZV8aCbqWRb0s3YyMTVQjGftOqcVWmjaGO/KgOZxs5QGnc2aiHkXSXmcTHfKFQFWiFkiVsngO4CI5tJrBOWkzg87tBp9bv4kSsaoQ6J2+rKloaB3+yfXZa20Z9dMW3aSLegTtlQhyerErRoldQhPRTNyXJhAF92xbAw+if5w2x83v3z1fGsTBjAn2k3urRCqkrvY7jTDPP2j63cfXSPOTjBOp8K0kXit1y52pba6Hctpa3qUSGzoe3JGa5C10oQcLCHepYd6h2ymF6+AFlL5KrHHf9ApeXoD/kHnaSsBxgCuepPtX1TzcWEDJ2kVlLO2e1wj/xZsqI1MSFDJ6mtM95ym4+hsmER77SiJv0HdeUdpNxs6fAi80NtYlg8mXnatI2OwYZj1zbY4cfHZzqLCpktzeULcqxBa2ITBmSDRwMWo6eRBCbGl8KaDqvPZsGIdRj91rDxQ6UKO9VSMpZyCl8HmQd1TLm1krA+pSk3JmRUFvTtpjs1BT6yEzNCvmhn9qioYKuQNNNhYt2d0n1YWbad2CChp4kcg24CVpOU8tEVNczdZds4FTLFSk1CO1GN6obI3F22kLGgG9WqasRjRXNDZCGVwmMe1mkTAdtBRi/LYe4u3caZt+Fjr0pwEx4NtfKYE0638Q+6zDqnhVy59blWaUxB0W2cLbMVZIWue7PObvTDXFOaWmLLrFSpuXANA6kspkcWmqYdtyt6xX64jCzJsULKgjafCRmX7KEml+VdYcFm7i7LnTEho6nU8rjMDZuzCvmw98M6jbpTvaITIGpsL9WVrY29H3bsmwqZl+LPT7Q4KEx5tg0WChmHbxfKc6mw3FLD3F0mZKjTZpseVWFrnDUOMB3Gdrkjddc8KzXCbReWP88CSmx3ZWFTL4GhbG5hdfHKzZrP4hFMyEhiamW4LXJd4dMs3sL6ivmL0qrE3KoVSnx+GJzGI1h6tLLzSRH3mJAs3saivkzIMH+xIqWWIPLXJIng9et+v1wuu2c++/1wtwtpyOn9rZliWpVSezCvr2+rYRaPnuoOKFbLQ41UqjKqI7lSOH0D+q+Q2qp85UnrJB1UqFYrVgLdrZ9umLLdumq56BvDYQavJ4eqpmU6lPpEM/FPxgm4p1lOsz8rzDkX+A+Re7mIt+NR1TEvuFjEeyrILx82p6Un1Xyc4IPQ9ozUoKt+cMA/s77bYb7eW7f17S29rs2hNRF+BtZpjEdVZPjK0A5fS953Z5IB9xCwKWjWHA5fz0zO7K8hjluQ4xLnmM/7/TDc7d7fN5tN68F6vV4sVqvTmfYZk7Jq3zAcSGehSndMCYa7hQYhO8svzAZDguFw/8mgSFjS1R3TKYa75DPsLCxP746h1Cj5Ss9vBoasnoDsLjUkOxS61BBOibKvhkGjcaEGnxff918MMVb5PRMxhuuYolIN+Q6Nqyb4VSVRJN+QOVa4a8ZQaiRUDLdtadwbumOlxsEBHhXQ6FJ+jC/6vNawJmh8Rsund3x0jefGNe5D4IIqEmOGg7AaH9HyUHH8xTKPk2t8fc1LjV8UWxO2CvUZVu/4RfGDRhrXk/FBE/t77PWWuObxAZ/esQZkVxMd8gqyhZX6kBHMQ1eQNL8MG2L8CzNepcKcUpnxOveE0bGYOCNLlxqdi1e+SakPr48tNUoXE6aPgSff0ziddWT5XhnjtNuWPHVM/AC1q2z2j43vKy2Teomc9bfaNU+9/qPnyFejo8RU1Ls348xL44ZhVEQ/6d5IGpVqWJzvv9R8IzEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMC/zP9M5HLNwHTdjgAAAABJRU5ErkJggg==" alt="" />
              <div className={styles.levelData}>
                <p>SPECIAL DARK - 39</p>
                <span>1958 / 2714</span>
              </div>
            </div>

            <div className={styles.progressBarContainer}>
              <div className={styles.fillerProgressBar}></div>
            </div>

            <table>
              <tbody>
                <tr>
                  <td>Gols</td>
                  <td>{totalGoals}</td>
                </tr>
                <tr>
                  <td>Temporada</td>
                  <td>{totalGoals}</td>
                </tr>
                <tr>
                  <td>Rodada</td>
                  <td>57</td>
                </tr>
                <tr>
                  <td>Hora</td>
                  <td>{hourlyGoals}</td>
                </tr>
                <tr>
                  <td>Dinheiro</td>
                  <td>22560</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.teamLogoContainer}>
            { club ? (
              <>
                <img 
                  src={club.logoLink}
                  alt={`Logo ${club.name}`}
                />
                <strong>{club.name}</strong>
              </>
            ) : (
              <LoadingSpinner top='50%' left='50%' transform='translate(-50%, -50%)' />
            ) }
          </div>
        </div>
      )}
    </header> 
  )
}