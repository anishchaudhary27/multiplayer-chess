import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import { useHistory } from 'react-router-dom'

export default function Menu({ setgameId, seth }) {
    const [name, setname] = useState("")
    const [house, sethouse] = useState('w')
    const history = useHistory()
    const [wait, setwait] = useState(false)
    const params = new URLSearchParams(window.location.search)
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(house)
        if (params.get('action') === 'join') {
            const gameId = params.get('gameId')
            if (gameId && name !== '') {
                window.fetch('/api/join',
                    {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            name,
                            gameId
                        }),
                        method: "POST",
                        redirect: 'error'
                    })
                    .then(res => res.json())
                    .then(data => {
                        console.log(data.playerId);
                        setgameId(data.gameId)
                        seth(data.house)
                        window.localStorage.setItem(data.gameId, JSON.stringify({ playerId: data.playerId, name }))
                        history.push('/table')
                    })
                    .catch(err => {
                        setwait(false)
                        console.error(err)
                        window.alert('server side error occured')
                    })
            }
            else {
                window.alert('Please enter valid name or link might be wrong')
            }
        }
        else {
            if (name !== '') {
                const body = JSON.stringify({
                    name: name,
                    house: house
                })
                setwait(true)
                window.fetch('/api/create',
                    {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        method: "POST",
                        body,
                        redirect: 'error'
                    })
                    .then(res => res.json())
                    .then(data => {
                        console.log(data.playerId);
                        setgameId(data.gameId)
                        seth(data.house)
                        window.localStorage.setItem(data.gameId, JSON.stringify({ playerId: data.playerId, name }))
                        history.push('/table')
                    })
                    .catch(err => {
                        setwait(false)
                        console.error(err)
                        window.alert('server side error occured')
                    })
            }
            else {
                window.alert('Please enter valid name')
            }
        }
    }
    useEffect(() => {
        if (params.get('action') === 'join') {
            if (params.get('house') === 'w') {
                sethouse('w')
            }
            else {
                sethouse('b')
            }
        }
    }, [])
    const chooseHouse = (h) => {
        if (params.get('action') !== 'join' && !wait) {
            sethouse(h)
        }
    }
    return (
        <div className={styles.root}>
            <h1 className={styles.title}>Most Probably Chess</h1>
            <div className={styles.container}>
                <div className={(house === 'w') ? styles.card_selected : styles.card} onClick={() => chooseHouse('w')}>
                    <img src="/pieces/kw.png" />
                </div>
                <div className={(house === 'b') ? styles.card_selected : styles.card} onClick={() => chooseHouse('b')}>
                    <img src="/pieces/kb.png" style={{ transform: "rotate(180deg)" }} />
                </div>
            </div>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input type="text" value={name} disabled={wait} id="name" placeholder="Name" onChange={(e) => setname(e.target.value)} className={styles.name} />
                <input type="submit" disabled={wait} value={(params.get('action') === 'join') ? 'Join Room' : "Create Room"} className={styles.submit} />
            </form>
            {
                (params.get('action') === 'join') &&
                <p style={{ color: "white" }}>OR</p>
            }
            {
                (params.get('action') === 'join') &&

                <a href={"http://" + window.location.host} style={{ color: "#7289DA" }}>Create new room</a>
            }
        </div >
    )
}
