import { CircularProgress, MenuItem } from "@mui/material"
import { useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import ButtonsPopover from "../../../../components/ButtonsPopover"
import { versionActions } from "../../../../redux/slices/version.slice"
import versionsService from "../../../../services/versionsService"
import CreateRow from "../CreateRow"

const VersionsRow = ({ version, index }) => {
  const { projectId } = useParams()
  const dispatch = useDispatch()

  const selectedVersion = useSelector(
    (state) => state.version.selectedVersionId
  )

  const [loader, setLoader] = useState(false)
  const [textFieldVisible, setTextFieldVisible] = useState(false)

  const deleteVersion = () => {
    setLoader(true)
    versionsService
      .delete(version.id)
      .then((res) => {
        dispatch(versionActions.remove(version.id))
      })
      .catch(() => setLoader(false))
  }

  const updateVersionName = ({ title }) => {
    const data = {
      title,
      id: version.id,
      project_id: projectId,
    }

    versionsService.update(data).then((res) => {
      dispatch(
        versionActions.edit({
          index,
          data,
        })
      )
      setTextFieldVisible(false)
    })
  }

  const selectHandler = () => {
    dispatch(versionActions.setSelectedVersionId(version.id))
  }

  const isActive = useMemo(() => {
    return selectedVersion === version.id
  }, [selectedVersion, version.id])

  return (
    <MenuItem
      className={`row silver-bottom-border pointer ${isActive && "active"}`}
      onClick={selectHandler}
    >
      <div className="row-index">{index + 1}</div>
      {textFieldVisible ? (
        <CreateRow
          color={isActive ? "secondary" : "primary"}
          initialTitle={version.title}
          onSubmit={updateVersionName}
        />
      ) : (
        <>
          <div className="row-label">{version?.title}</div>
          <div className="version_percent" style={{ background: version?.percent < 80 || version?.percent === undefined ? '#F8DD4E' : '#1AC19D', 
          color: version?.percent < 80 || version?.percent === undefined ? '#000' : '#fff' }}>{version?.percent ? version?.percent : 0}%</div>
          <div className="row-btns">
            {loader ? (
              <div style={{ padding: "12px" }}>
                <CircularProgress disableShrink size={20} />
              </div>
            ) : (
              <ButtonsPopover
                buttonProps={{ color: isActive ? "secondary" : "primary" }} 
                onDeleteClick={deleteVersion}
                onEditClick={() => setTextFieldVisible(true)}
              />
            )}
          </div>
        </>
      )}
    </MenuItem>
  )
}

export default VersionsRow
