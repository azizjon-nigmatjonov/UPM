import Header from "../../components/Header"
import StatusCard from "./StatusCard"
import StagesCard from "./StagesCard"
import ProjectTypes from "./ProjectType"
import "./style.scss"

const StageStatuses = () => {
  return (
    <div className="StageStatusesPage">
      <Header title="Statuses" />
      <div className="stageStatusesContainer">
        <div>
          <StatusCard />
          <StagesCard />
        </div>
        <ProjectTypes />
      </div>
    </div>
  )
}

export default StageStatuses
