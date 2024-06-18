import ProjectsHeader from "../ProjectsHeader"
import ProjectDashboardTable from "./Table"
import "./style.scss"

const ProjectDashboard = () => {
  return (
    <div className="ProjectDashboard">
      {/* <ProjectsHeader /> */}
      <div style={{ padding: "20px" }}>
        <ProjectDashboardTable />
      </div>
    </div>
  )
}

export default ProjectDashboard
