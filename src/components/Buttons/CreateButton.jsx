import LoadingButton from '@mui/lab/LoadingButton';
import AddIcon from "@mui/icons-material/Add"

const CreateButton = ({ children, title = "Create", ...props }) => {
  return (
    <LoadingButton
      style={{ minWidth: 130 }}
      startIcon={<AddIcon />}
      variant="contained"
      loadingPosition="start"
      {...props}
    >
      {title}
    </LoadingButton>
  )
}

export default CreateButton
