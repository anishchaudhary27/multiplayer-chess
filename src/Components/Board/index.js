import React, { useState } from 'react'
import styles from './styles.module.css'
import { MessagePasser } from '../../MessagePasser'

export default function Board({ house, pieces, turn, playerId }) {
    const arr = [0, 1, 2, 3, 4, 5, 6, 7]
    let board = []
    for (let index = 0; index < 64; index++) {
        board.push('')
    }
    for (const piece in pieces) {
        board[pieces[piece]] = piece
    }
    const [selected, setselected] = useState(-1)
    const handleClick = (key) => {
        if (turn === '' || turn !== house) {
            return
        }

        if (board[key] === '') {
            if (selected > -1) {
                console.log(key);
                MessagePasser.sendMessage(JSON.stringify({
                    intent: 'move',
                    playerId: playerId,
                    from: selected,
                    to: key
                }))
                setselected(-1)
            }
        }
        else {
            if (board[key][1] === house) {
                setselected(key)
            }
            else {
                if (selected > -1) {
                    MessagePasser.sendMessage(JSON.stringify({
                        intent: 'move',
                        playerId: playerId,
                        from: selected,
                        to: key
                    }))
                    setselected(-1)
                }
            }
        }
    }
    return (
        <div className={styles.root}>
            <div className={(house === 'w') ? styles.main_white : styles.main_black}>
                {
                    arr.map(i => {
                        return <div className={styles.row} key={i}>
                            {
                                arr.map(j => {
                                    const ind = 8 * i + j
                                    if ((i + ind) % 2 === 0) {
                                        return <div
                                            className={(selected === ind) ? styles.square_even_selected : styles.square_even}
                                            onClick={() => handleClick(ind)} key={ind}>
                                            {
                                                (board[ind] !== undefined && board[ind] !== '') &&
                                                <img src={`/pieces/${board[ind].slice(0, 2)}.png`} />
                                            }
                                        </div>
                                    }
                                    return <div
                                        className={(selected === ind) ? styles.square_odd_selected : styles.square_odd}
                                        onClick={() => handleClick(ind)} key={ind}>
                                        {
                                            (board[ind] !== undefined && board[ind] !== '') &&
                                            <img src={`/pieces/${board[ind].slice(0, 2)}.png`} />
                                        }
                                    </div>
                                })
                            }
                        </div>
                    })
                }
            </div>
        </div>
    )
}
