import { AiFillFire } from 'react-icons/ai'
import { GiSpikyWing, GiAbstract024, GiAbstract079, GiAbstract116, GiConcentrationOrb } from 'react-icons/gi'

import styles from './styles.module.scss'

export function GoalsAmount() {

  return (
    <div className={styles.goalsAmountContainer}>
      <div className={styles.hourlyGoalsContainer}>
        <h2>Hora</h2>

        <ul>
          <li>
            <div className={styles.borderBottom}></div>
            <div className={styles.playerIdentification}>
              <div className={styles.rankingPosition}>1</div>
              <AiFillFire className={styles.iconPlayerLevel} />
              <a href="" className={styles.iconplayerClub}>
                <img src="https://svgshare.com/i/gps.svg" alt="" />
              </a>
              <a href="">
                Gustavo_Polonio
              </a>
            </div>
            29
          </li>
          <li>
            <div className={styles.borderBottom}></div>
            <div className={styles.playerIdentification}>
              <div className={styles.rankingPosition}>2</div>
              <GiSpikyWing className={styles.iconPlayerLevel} />
              <a href="" className={styles.iconplayerClub}>
                <img src="https://vetores.org/d/palmeiras.svg" alt="" />
              </a>
              <a href="">
                Boexatinha_
              </a>
            </div>
            29
          </li>
          <li>
            <div className={styles.borderBottom}></div>
            <div className={styles.playerIdentification}>
              <div className={styles.rankingPosition}>3</div>
              <GiAbstract024 className={styles.iconPlayerLevel} />
              <a href="" className={styles.iconplayerClub}>
                <img src="https://vetores.org/d/sao-paulo-futebol-clube.svg" alt="" />
              </a>
              <a href="">
                Raul99
              </a>
            </div>
            28
          </li>
          <li>
            <div className={styles.borderBottom}></div>
            <div className={styles.playerIdentification}>
              <div className={styles.rankingPosition}>4</div>
              <AiFillFire className={styles.iconPlayerLevel} />
              <a href="" className={styles.iconplayerClub}>
                <img src="https://cdn.worldvectorlogo.com/logos/coritiba.svg" alt="" />
              </a>
              <a href="">
                Cris_90
              </a>
            </div>
            26
          </li>
          <li>
            <div className={styles.borderBottom}></div>
            <div className={styles.playerIdentification}>
              <div className={styles.rankingPosition}>5</div>
              <GiAbstract079 className={styles.iconPlayerLevel} />
              <a href="" className={styles.iconplayerClub}>
                <img src="https://vetores.org/d/cuiaba.svg" alt="" />
              </a>
              <a href="">
                Pindato
              </a>
            </div>
            24
          </li>
          <li>
            <div className={styles.borderBottom}></div>
            <div className={styles.playerIdentification}>
              <div className={styles.rankingPosition}>6</div>
              <GiAbstract116 className={styles.iconPlayerLevel} />
              <a href="" className={styles.iconplayerClub}>
                <img src="https://svgshare.com/i/gps.svg" alt="" />
              </a>
              <a href="">
                _m3ss1_
              </a>
            </div>
            21
          </li>
          <li>
            <div className={styles.borderBottom}></div>
            <div className={styles.playerIdentification}>
              <div className={styles.rankingPosition}>7</div>
              <GiConcentrationOrb className={styles.iconPlayerLevel} />
              <a href="" className={styles.iconplayerClub}>
                <img src="https://cdn.worldvectorlogo.com/logos/coritiba.svg" alt="" />
              </a>
              <a href="">
                fRedo
              </a>
            </div>
            21
          </li>
          <li>
            <div className={styles.borderBottom}></div>
            <div className={styles.playerIdentification}>
              <div className={styles.rankingPosition}>8</div>
              <GiAbstract079 className={styles.iconPlayerLevel} />
              <a href="" className={styles.iconplayerClub}>
                <img src="https://vetores.org/d/flamengo.svg" alt="" />
              </a>
              <a href="">
                Luotal
              </a>
            </div>
            19
          </li>
          <li>
            <div className={styles.borderBottom}></div>
            <div className={styles.playerIdentification}>
              <div className={styles.rankingPosition}>9</div>
              <AiFillFire className={styles.iconPlayerLevel} />
              <a href="" className={styles.iconplayerClub}>
                <img src="https://vetores.org/d/fluminense.svg" alt="" />
              </a>
              <a href="">
                Benee
              </a>
            </div>
            17
          </li>
          <li>
            <div className={styles.borderBottom}></div>
            <div className={styles.playerIdentification}>
              <div className={styles.rankingPosition}>10</div>
              <GiConcentrationOrb className={styles.iconPlayerLevel} />
              <a href="" className={styles.iconplayerClub}>
                <img src="https://vetores.org/d/flamengo.svg" alt="" />
              </a>
              <a href="">
                paivinha
              </a>
            </div>
            15
          </li>
        </ul>
      </div>
    </div>  
  )
}