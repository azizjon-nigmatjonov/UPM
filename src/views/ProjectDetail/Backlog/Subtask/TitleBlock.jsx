import {
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from "@mui/material"
import SaveIcon from "@mui/icons-material/Save"
import EditIcon from "@mui/icons-material/Edit"
import DescriptionIcon from "@mui/icons-material/Description"
import { useState } from "react"
import subtaskService from "../../../../services/subtaskService"
import TypographyWithIcon from "../../../../components/TypographyWithIcon"

const TitleBlock = ({ data, onChange=()=>{} }) => {
  const [value, setValue] = useState(data?.title || "")
  const [editable, setEditable] = useState(false)
  const [loader, setLoader] = useState(false)

  const updateTitle = () => {
    setLoader(true)
    subtaskService
      .update({
        ...data,
        title: value,
      })
      .then((res) => {
        setEditable(false)
        onChange(res.title)
      })
      .finally(() => setLoader(false))
  }

  const submitHandler = () => {
    updateTitle()
  }

  return (
    <div className="title-block silver-bottom-border">
      {!editable ? (
        <Typography variant="h5">{value}</Typography>
      ) : (
        <TextField
          size="small"
          fullWidth
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      )}

      {!editable ? (
        <div>
          <IconButton color="primary" onClick={(_) => setEditable(true)}>
            <EditIcon />
          </IconButton>
        </div>
      ) : loader ? (
        <div>
          <IconButton color="primary">
            <CircularProgress size={26} />
          </IconButton>
        </div>
      ) : (
        <div>
          <IconButton color="primary" onClick={submitHandler}>
            <SaveIcon />
          </IconButton>
        </div>
      )}
    </div>
  )
}

export default TitleBlock
