import Home from 'pages/home'
import 'states/send-msg' // active send-msg that sending msg back to content-script
import Settings from 'components/settings'
import './app.sass'

export default function App() {
  return (
    <main
      css={`
        width: 100%;
        overflow: auto;
        background-color: #fff;
        padding-top: 40px;
      `}>
      <Settings
        css={`
          width: 100vw;
        `}
      />
      <Home />
    </main>
  )
}
