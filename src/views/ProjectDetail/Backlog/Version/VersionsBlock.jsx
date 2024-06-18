import { Collapse } from "@mui/material"
import { useState } from "react"
import versionsService from "../../../../services/versionsService"
import CreateRow from "../CreateRow"
import VersionsRow from "./VersionsRow"
import RowLinearLoader from "../../../../components/RowLinearLoader"
import CreateRowButton from "../../../../components/CreateRowButton"
import { useParams } from "react-router-dom"
import { Container, Draggable } from "react-smooth-dnd"
import { applyDrag } from "../../../../utils/applyDrag"
import { useDispatch, useSelector } from "react-redux"
import { versionActions } from "../../../../redux/slices/version.slice"

const VersionsBlock = () => {
  const { projectId } = useParams()
  const dispatch = useDispatch()

  const loader = useSelector(state => state.version.loader)
  const versionsList = useSelector(state => state.version.list)

  const [createFormVisible, setCreateFormVisible] = useState(false)
  const [createLoader, setCreateLoader] = useState(false)


  const createNewVersion = ({ title }) => {
    setCreateLoader(true)
    versionsService
      .create(projectId, title)
      .then((res) => {
        setCreateFormVisible(false)
        dispatch(versionActions.add(res))
      })
      .catch(() => setCreateLoader(false))
  }

  const onDrop = (dropResult) => {
    const result = applyDrag(versionsList, dropResult)

    if (result) {
      dispatch(versionActions.setList(result))
      updateVersionOrder(dropResult)
    }
  }

  const updateVersionOrder = ({ removedIndex, addedIndex }) => {
    versionsService.updateOrder(versionsList[removedIndex].id, addedIndex + 1)
  }
  return (
    <>
      <div className="card silver-right-border" style={{ flex: 1 }}>
        <div className="card-header silver-bottom-border">
          <div className="card-title">VERSIONS</div>
          <div className="card-extra">
            <CreateRowButton
              formVisible={createFormVisible}
              setFunction={setCreateFormVisible}
            />
          </div>
          <RowLinearLoader visible={loader} />
        </div>

        <Collapse in={createFormVisible} className="silver-bottom-border">
          <CreateRow
            onSubmit={createNewVersion}
            loader={createLoader}
            setLoader={setCreateLoader}
            visible={createFormVisible}
            setVisible={setCreateFormVisible}
            placeholder="Version title"
          />
        </Collapse>

        <Container
          onDrop={onDrop}
          lockAxis="y"
          dropPlaceholder={{ className: "drag-row-drop-preview" }}
        >
          {versionsList?.map((version, index) => (
            <Draggable key={version.id}>
              <VersionsRow
                key={version.id}
                version={version}
                index={index}
              />
            </Draggable>
          ))}
        </Container>
      </div>
    </>
  )
}

export default VersionsBlock
