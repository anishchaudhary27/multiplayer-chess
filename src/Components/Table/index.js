import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import Board from '../Board'
import Infobar from '../Infobar'
import { useHistory } from 'react-router-dom'
import { MessagePasser } from '../../MessagePasser'

export default function Table({ gameId, house }) {
    const [pieces, setpieces] = useState([])
    const [oponent, setoponent] = useState("")
    const [turn, setturn] = useState('')
    const player = JSON.parse(window.localStorage.getItem(gameId))
    const history = useHistory()
    if (!player) {
        history.push('/')
    }
    useEffect(() => {
        if (gameId === '') {
            history.push('/')
        }
        let conn = new WebSocket(`ws://${window.location.hostname}`)
        let sub = MessagePasser.getMessage().subscribe(data => {
            conn.send(data.text)
        })
        conn.onmessage = (message) => {
            const data = JSON.parse(message.data)
            switch (data.intent) {
                case "state":
                    setpieces(data.state)
                    setturn(data.turn)
                    if (house === 'w') {
                        if (data.b !== undefined) {
                            setoponent(data.b.name)
                        }
                    }
                    else {
                        if (data.w !== undefined) {
                            setoponent(data.w.name)
                        }
                    }
                    break;
                default:
                    break;
            }
        }
        conn.onopen = (ev) => {
            conn.send(JSON.stringify({
                intent: 'subscribe',
                gameId: gameId,
                house,
                name: player.name,
                playerId: player.playerId
            }))
        }
        return () => {
            conn.close()
            sub.unsubscribe()
        }
    }, [])
    return (
        <div className={styles.root}>
            {
                (player) &&
                <Board house={house} pieces={pieces} turn={turn} playerId={player.playerId} />
            }
            <Infobar house={house} pieces={pieces} gameId={gameId} oponent={oponent} />
        </div>
    )
}
