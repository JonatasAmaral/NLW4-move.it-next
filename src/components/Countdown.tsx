import { clear } from 'console';
import { useState, useEffect, useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';
import { CountdownContext } from '../contexts/CountdownContext';
import styles from '../styles/components/Countdown.module.css';

export function Countdown(){

    const { minutes, seconds,
        isActive, hasFinished,
        startCountdown, resetCountdown
    } = useContext(CountdownContext)

    const {activeChallenge} = useContext(ChallengesContext)

    useEffect(() =>{
        if (activeChallenge) return;
        resetCountdown();
    }
        ,[activeChallenge]
    )

    const digitsMinutes = String(minutes).padStart(2, '0').split('');
    const digitsSeconds = String(seconds).padStart(2, '0').split('');

    return(
        <div>
            <div className={styles.countdownContainer} onClick={resetCountdown}>
                <div>
                    <span>{digitsMinutes[0] || 0}</span>
                    <span>{digitsMinutes[1] || 0}</span>
                </div>
                <span>:</span>
                <div>
                    <span>{digitsSeconds[0] || 0}</span>
                    <span>{digitsSeconds[1] || 0}</span>
                </div>
            </div>

            {/* equal to [ has? (val) : _null_ ] */}
            {hasFinished ? (
                <button 
                    className={`${styles.countdownButton}`}
                    disabled
                >   
                    {/* 😀✅✔🟢✔️✓ */}
                    Ciclo encerrado <span className="icon-">✓</span>
                </button>
            ) : (

                // tirar os '{.}' ao inves de usar o react fragment '<>.</>'
                isActive? (
                    <button 
                        type="button" 
                        className={`${styles.countdownButton} ${styles.countdownButtonActive}`}
                        onClick={resetCountdown}
                    >   
                        {/* ☓ ✗ ✖ */}
                        Abandonar o ciclo <span className="icon-">✖</span>
                    </button>
                ):(
                    <button 
                        type="button" 
                        className={styles.countdownButton}
                        onClick={startCountdown}
                    >   
                        Iniciar um ciclo <span className="icon-">▶</span>
                    </button>
                )
            )}
        </div>
    );
}
