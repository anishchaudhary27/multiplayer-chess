const express = require('express')
const http = require('http')
const { v4: uuid } = require('uuid')
var WebSocketServer = require('websocket').server
var cors = require('cors')

let clients = []
let games = []
let players = []

const init_pieces = {
    eb1: 0, hb1: 1, cb1: 2, kb: 3, qb: 4, cb2: 5, hb2: 6, eb2: 7,
    pb1: 8, pb2: 9, pb3: 10, pb4: 11, pb5: 12, pb6: 13, pb7: 14, pb8: 15,
    ew1: 56, hw1: 57, cw1: 58, kw: 59, qw: 60, cw2: 61, hw2: 62, ew2: 63,
    pw1: 48, pw2: 49, pw3: 50, pw4: 51, pw5: 52, pw6: 53, pw7: 54, pw8: 55,
}

const restServer = express()
restServer.use(cors())
const server = http.createServer(restServer)
server.listen(80, () => console.log('server started at port 80'))
restServer.use(express.json())
restServer.post('/api/join', (req, res) => {
    const name = req.body.name
    const gameId = req.body.gameId
    const playerId = uuid()
    if (games[gameId] === undefined) {
        res.status(404).send('game id not found')
        return
    }
    games[gameId].turn = 'w'
    if (games[gameId]['w'] === undefined) {
        games[gameId]['w'] = {
            playerId,
            house: 'w'
        }
        players[playerId] = {
            house: 'w',
            gameId
        }
        res.json({
            playerId,
            house: 'w',
            gameId
        })
    }
    else {
        if (games[gameId]['b'] === undefined) {
            games[gameId]['b'] = {
                playerId,
                name
            }
            players[playerId] = {
                house: 'b',
                gameId
            }
            res.json({
                playerId,
                house: 'b',
                gameId
            })
        }
        else {
            res.status(400).send('already full')
        }
    }
})

restServer.post('/api/create', (req, res) => {
    const name = req.body.name
    const house = req.body.house
    const gameId = uuid()
    const playerId = uuid()
    games[gameId] = {
        state: init_pieces,
        turn: ''
    }
    games[gameId][house] = {
        playerId,
        name
    }
    players[playerId] = {
        house,
        gameId
    }
    res.json({
        playerId,
        house,
        gameId
    })
})

restServer.use(express.static('./build'))
restServer.get('/*', (req, res) => {
    res.sendFile(__dirname + '/build/index.html')
})

const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
})

wsServer.on('request', (req) => {
    const conn = req.accept(null)
    const clientId = uuid()
    clients[clientId] = conn
    conn.on('message', (message) => {
        const req = JSON.parse(message.utf8Data)
        switch (req.intent) {
            case "subscribe":
                if (games[req.gameId] !== undefined) {
                    const game = games[req.gameId]
                    if (game[req.house].playerId === req.playerId) {
                        players[req.playerId]["clientId"] = clientId
                        if (game.b != undefined && clients[players[game.b.playerId].clientId]) {
                            clients[players[game.b.playerId].clientId].sendUTF(JSON.stringify({
                                intent: 'state',
                                turn: game.turn,
                                state: game.state,
                                b: game.b,
                                w: game.w
                            }))
                        }
                        if (game.w != undefined && clients[players[game.w.playerId].clientId]) {
                            clients[players[game.w.playerId].clientId].sendUTF(JSON.stringify({
                                intent: 'state',
                                turn: game.turn,
                                state: game.state,
                                w: game.w,
                                b: game.b
                            }))
                        }
                    }
                }
                break;
            case "move":
                const playerId = req.playerId
                const player = players[playerId]
                const game = games[player.gameId]
                const house = player.house
                let pieces = game.state
                let board = []
                for (let index = 0; index < 64; index++) {
                    board.push('')
                }
                for (const piece in pieces) {
                    board[pieces[piece]] = piece
                }
                board[req.to] = board[req.from]
                board[req.from] = ''
                board.forEach((val, n) => {
                    if (val !== '') {
                        games[player.gameId].state[val] = n
                    }
                })
                console.log(board);
                games[player.gameId].turn = (game.turn === 'w') ? 'b' : 'w'
                if (game.b != undefined && clients[players[game.b.playerId].clientId]) {
                    clients[players[game.b.playerId].clientId].sendUTF(JSON.stringify({ intent: 'state', turn: games[player.gameId].turn, state: games[player.gameId].state, b: games[player.gameId].b, w: games[player.gameId].w }))
                }
                if (game.w != undefined && clients[players[game.w.playerId].clientId]) {
                    clients[players[game.w.playerId].clientId].sendUTF(JSON.stringify({ intent: 'state', turn: games[player.gameId].turn, state: games[player.gameId].state, w: games[player.gameId].w, b: games[player.gameId].b }))
                }
                break;
            default:
                break;
        }
    })
    conn.on('close', (code, desc) => {
        clientId[clientId] = null
    })
})