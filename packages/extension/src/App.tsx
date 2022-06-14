/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Container, Box } from 'theme-ui'
import { useEffect } from 'react'
import { sendReadySignal } from './states/general'
import Renderer from 'components/renderer'
import './app.sass'

function App() {
  useEffect(() => {
    sendReadySignal()
  }, [])
  return (
    <Container sx={{ width: '100%', height: '100vh' }}>
      <Box sx={{ maxHeight: '100vh', overflow: 'auto', backgroundColor: '#fff' }}>
        <Renderer />
      </Box>
    </Container>
  )
}

export default App
