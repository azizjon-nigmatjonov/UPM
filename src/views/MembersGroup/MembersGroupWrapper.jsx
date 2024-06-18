import { Outlet } from "react-router-dom"
import ProjectsHeader from "../ProjectDetail/ProjectsHeader"

const MembersGroupWrapper = () => {
  return (
    <div className="MembersGroupWrapper">
      {/* <ProjectsHeader extra={null} /> */}
      <Outlet />
    </div>
  )
}

export default MembersGroupWrapper
