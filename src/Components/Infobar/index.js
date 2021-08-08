import React from 'react'
import styles from './styles.module.css'
import { useHistory } from 'react-router-dom'

export default function Infobar({ gameId, house, oponent }) {
    const history = useHistory()
    const handleLeave = () => {
        history.push('/')
    }
    const copyInviteLink = () => {
        if (house === 'w') {
            navigator.clipboard.writeText(`http://${window.location.host}/?action=join&gameId=${gameId}&house=b`)
        }
        else {
            navigator.clipboard.writeText(`http://${window.location.host}/?action=join&gameId=${gameId}&house=w`)
        }
    }
    return (
        <div className={styles.root}>
            <h2 style={{ color: "white" }}>Oponent</h2>
            <p className={styles.oponent}>{oponent}</p>
            {
                oponent === '' &&
                <button className={styles.invite} onClick={copyInviteLink}>
                    Copy Invitation link
                </button>
            }
            <button className={styles.leave} onClick={handleLeave}>
                Leave Game
            </button>
        </div>
    )
}
