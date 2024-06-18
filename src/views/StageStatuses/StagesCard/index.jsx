import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import StageRow from "./StageRow"
import FormCard from "../../../components/FormCard"
import RingLoaderWithWrapper from "../../../components/Loaders/RingLoader/RingLoaderWithWrapper"
import {
  createProjectStageAction,
  getProjectStagesListAction,
} from "../../../redux/thunks/projectStage.thunk"
import TitleCreateForm from "../../../components/CreateForms/TitleCreateForm"

const StagesCard = () => {
  const dispatch = useDispatch()

  const list = useSelector(
    (state) => state.projectStage.list
  )
  const loader = useSelector((state) => state.projectStage.loader)

  const [createLoader, setCreateLoader] = useState(false)
  const [createFormVisible, setCreateFormVisible] = useState(false)

  const closeCreateForm = () => setCreateFormVisible(false)

  useEffect(() => {
    dispatch(getProjectStagesListAction())
  }, [])

  const createStage = ({ title }) => {
    setCreateLoader(true)

    const data = {
      title,
    }

    dispatch(createProjectStageAction(data))
      .unwrap()
      .then(() => closeCreateForm())
      .finally(() => setCreateLoader(false))
  }

  return (
    <div>
      <FormCard visible title="Stages">
        {loader ? (
          <RingLoaderWithWrapper />
        ) : (
          <div className="StatusGroup silver-bottom-border">
            <div className="status-list">
              {list?.map((stage) => (
                <StageRow key={stage.id} stage={stage} />
              ))}
            </div>
            <TitleCreateForm
              formVisible={createFormVisible}
              setFormVisible={setCreateFormVisible}
              loader={createLoader}
              onSubmit={createStage}
              closeForm={closeCreateForm}
              title="Create new stage"
            />
          </div>
        )}
      </FormCard>
    </div>
  )
}

export default StagesCard
