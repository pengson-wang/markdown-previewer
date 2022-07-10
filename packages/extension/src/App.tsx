import Home from 'pages/home'
import Preferences from 'pages/preferences'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import 'states/send-msg' // active send-msg that sending msg back to content-script
import Nav from 'react-bootstrap/Nav'
import { NavLink } from 'react-router-dom'
import './app.sass'

function Toolbar() {
  return (
    <Nav
      css={`
        background-color: #ecf0fe;
        position: fixed;
        width: 100%;
        height: 40px;
        top: 0;
        a {
          text-decoration: none;
          &.active {
            font-weight: bold;
            text-decoration: underline;
          }
        }
      `}>
      <Nav.Item>
        <Nav.Link>
          <NavLink to="/">Home</NavLink>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link>
          <NavLink to="/preferences">Preferences</NavLink>
        </Nav.Link>
      </Nav.Item>
    </Nav>
  )
}

export default function App() {
  return (
    <main
      css={`
        width: 100%;
        overflow: auto;
        background-color: #fff;
        padding-top: 40px;
      `}>
      <BrowserRouter>
        <Toolbar />
        <section
          css={`
            padding: 24px;
          `}>
          <Routes>
            <Route path="/">
              <Route index element={<Home />} />
              <Route path="preferences" element={<Preferences />} />
            </Route>
          </Routes>
        </section>
      </BrowserRouter>
    </main>
  )
}
