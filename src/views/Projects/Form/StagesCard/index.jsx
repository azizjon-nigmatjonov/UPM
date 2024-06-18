import FormCard from "../../../../components/FormCard"
import { useSelector } from "react-redux"
import StageRow from "./StageRow"
import RingLoaderWithWrapper from "../../../../components/Loaders/RingLoader/RingLoaderWithWrapper"

const StagesCard = () => {

  const stagesList = useSelector((state) => state.projectStage.list)
  const loader = useSelector((state) => state.projectStage.loader)

  return (
    <div>
      <FormCard visible title="Stages">
        {loader ? (
          <RingLoaderWithWrapper />
        ) : (
          <div className="StatusGroup silver-bottom-border">
            <div className="status-list">
              {stagesList?.map((stage) => (
                <StageRow key={stage.id} stage={stage} />
              ))}
            </div>
          </div>
        )}
      </FormCard>
    </div>
  )
}

export default StagesCard
