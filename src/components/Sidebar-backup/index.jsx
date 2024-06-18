import "./style.scss"
import UdevsLogo from "../../assets/icons/udevs-logo.svg"
import SafiaLogo from "../../assets/icons/safia-logo.svg"
import AnorLogo from "../../assets/icons/anor-logo.svg"
import MaxWayLogo from "../../assets/icons/maxway-logo.svg"
import { NavLink } from "react-router-dom"

const Sidebar = () => {
  return (
    <div className="Sidebar" >
      <div className="logo-block">
        <img src={UdevsLogo} alt="logo" />
      </div>
      
      <div className="projects-block">
      
        <NavLink to="/projects/61c476a86cbddc4a557751ba/backlog" replace className="project-card">
          <div className="project-logo">
            <img src={SafiaLogo} alt="safia-logo" />
          </div>
        </NavLink>

        <NavLink to="/projects/a0329fa5-ff8a-4045-956f-82760cacf4dc/backlog" replace className="project-card">
          <div className="project-logo">
            <img src={AnorLogo} alt="safia-logo" />
          </div>
        </NavLink>

        <NavLink to="/projects/a0329fa5-ff8a-4045-956f-82760cacf4dc/backlog" replace className="project-card">
          <div className="project-logo">
            <img src={MaxWayLogo} alt="safia-logo" />
          </div>
        </NavLink>

        {/* <div className="project-card">
          <div className="project-logo">
            <img src={MaxWayLogo} alt="safia-logo" />
          </div>
        </div> */}
      </div>

    </div>
  )
}

export default Sidebar
