import { NavLink } from 'react-router-dom'
import SettingsIcon from 'previewer/components/icons/settings-icon'

export default function Sidebar() {
  return (
    <aside
      css={`
        width: 32px;
        position: fixed;
        top: 0;
        right: 0;
        padding: 8px 4px;
        height: 100vh;
        min-height: 100vh;
      `}>
      <nav
        css={`
          display: flex;
          flex-direction: column;
        `}>
        <NavLink
          to="/themes"
          css={`
            text-align: center;
          `}>
          <SettingsIcon />
        </NavLink>
      </nav>
    </aside>
  )
}
