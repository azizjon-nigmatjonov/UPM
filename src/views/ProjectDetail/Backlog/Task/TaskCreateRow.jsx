import {
  Checkbox,
  CircularProgress,
  IconButton,
  Skeleton,
} from "@mui/material"
import SaveIcon from "@mui/icons-material/Save"
import { useFormik } from "formik"
import { useEffect, useState } from "react"
import OutsideClickHandler from "react-outside-click-handler"
import "./style.scss"
import FTextField from "../../../../components/FormElements/FTextField"
import { useSelector } from "react-redux"


const TaskCreateRow = ({
  onSubmit,
  loader,
  btnLoader,
  visible,
  setLoader = () => {},
  setVisible = () => {},
  initialTitle,
  color = "primary",
}) => {


  const stagesList = useSelector((state) => state.projectStage.list)
  const [stageBlockVisible, setStageBlockVisible] = useState(false)
  const [checkedStages, setCheckedStages] = useState([])

  const onChecked = (val, id) => {
    if(val) setCheckedStages(prev => [...prev, id])
    else setCheckedStages(prev => prev.filter(el => el.id !== id))
  }
  
  useEffect(() => {
    if (visible) {
      setLoader(false)
    } else {
      formik.setFieldValue("title", initialTitle || "")
      setCheckedStages([])
    }
  }, [visible])

  useEffect(() => {
    setTimeout(() => {
      setStageBlockVisible(true)
    }, 300)
  }, [])

  const submitHandler = ({ title }) => {
    const selectedStages = stagesList.filter(stage => checkedStages.includes(stage.id))
    onSubmit({
      title,
      stages: selectedStages
    })
  }

  const formik = useFormik({
    initialValues: {
      title: initialTitle || "",
    },
    onSubmit: submitHandler,
  })

  return (
    <OutsideClickHandler
      display="contents"
      onOutsideClick={() => setVisible(false)}
    >
      <form
        onSubmit={formik.handleSubmit}
        className="TaskCreateRow"
        style={{ width: "100%" }}
        aria-describedby={"123"}
      >
        {loader ? (
          <Skeleton variant="text" style={{ width: "100%" }} />
        ) : (
          <>
            <FTextField
              onClick={(e) => e.stopPropagation()}
              fullWidth
              formik={formik}
              name="title"
              disabledHelperText
              autoFocus
            />
            <IconButton color={color} onClick={formik.handleSubmit}>
              {btnLoader ? <CircularProgress size={14} /> : <SaveIcon />}
            </IconButton>
          </>
        )}
        {stageBlockVisible && !loader && (
          <div className="TaskCreateRow__stages-block">
            {stagesList?.map((stage) => (
              <div key={stage.id} className="stage-row silver-bottom-border">
                <p className="label">{ stage.title }</p>
                <Checkbox onChange={(_, val) => onChecked(val, stage.id)} />
              </div>
            ))}
          </div>
        )}
      </form>
    </OutsideClickHandler>
  )
}

export default TaskCreateRow
