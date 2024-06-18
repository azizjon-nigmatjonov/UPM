import ProjectsHeader from "../ProjectsHeader"
import EpicsBlock from "./Epics/EpicsBlock"
import SprintsBlock from "./Sprint/SprintsBlock"
import "./style.scss"
import VersionsBlock from "./Version/VersionsBlock"

// const projectId = "afebee0-2b1e-40db-8eac-59d2539b3b4f"

const BacklogPage = () => {
  return (
    // <AnimatedPage>
      <div className="BacklogPage">
        {/* <ProjectsHeader extra={null} /> */}
        <div className="main-area">
          <VersionsBlock />
          <EpicsBlock insideBacklog/>
          <SprintsBlock />
        </div>
      </div>
    // </AnimatedPage>
  )
}

export default BacklogPage
