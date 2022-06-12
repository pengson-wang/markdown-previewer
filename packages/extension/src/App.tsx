/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Container, Box } from 'theme-ui'
import React, { useEffect, useMemo } from 'react'
import { useObservable } from 'rxjs-hooks'
import { sendReadySignal, $fileRelativePath } from './states/general'
import MarkdownRenderer from 'components/MarkdownRenderer'
import { useFilePublishLink } from 'hooks/usePublicLink'
import './app.sass'

function App() {
  const filePublishLink = useFilePublishLink()
  const fileRelativePath = useObservable(() => $fileRelativePath)
  const isNav = useMemo(() => (fileRelativePath ? /nav.yaml$/.test(fileRelativePath) : false), [fileRelativePath])
  useEffect(() => {
    sendReadySignal()
  }, [])
  return (
    <Container sx={{ width: '100%', height: '100vh' }}>
      <Box sx={{ padding: '1em 2em', maxHeight: '100vh', overflow: 'auto', backgroundColor: isNav ? '#229bff' : '#fff' }}>
        <MarkdownRenderer />
      </Box>
    </Container>
  )
}

export default App
