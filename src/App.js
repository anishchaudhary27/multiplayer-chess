import Menu from './Components/Menu'
import Table from './Components/Table'
import { Route, Switch } from 'react-router-dom'
import { useState } from 'react'

function App() {
  const [gameId, setgameId] = useState('')
  const [h, seth] = useState('w')
  return (
    <Switch>
      <Route exact path="/">
        <Menu setgameId={setgameId} seth={seth} />
      </Route>
      <Route path="/table">
        <Table gameId={gameId} house={h} />
      </Route>
    </Switch>
  )
}

export default App
