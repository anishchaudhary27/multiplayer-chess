import React from 'react'
import styles from './styles.module.css'
import { useHistory } from 'react-router-dom'
import { useState, useEffect } from 'react/cjs/react.production.min'

export default function Infobar({ gameId, house, oponent }) {
    const history = useHistory()
    const [link, setlink] = useState("")
    const handleLeave = () => {
        history.push('/')
    }
    useEffect(() => {
        if (house === 'w') {
            setlink(`http://${window.location.host}/?action=join&gameId=${gameId}&house=b`)
        }
        else {
            setlink(`http://${window.location.host}/?action=join&gameId=${gameId}&house=w`)
        }
    }, [])
    const copyInviteLink = () => {
        navigator.clipboard.writeText(link)
    }
    return (
        <div className={styles.root}>
            <h2 style={{ color: "white" }}>Oponent</h2>
            <p className={styles.oponent}>{oponent}</p>
            {oponent === '' && <p className={styles.oponent}>{link}</p>}
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
