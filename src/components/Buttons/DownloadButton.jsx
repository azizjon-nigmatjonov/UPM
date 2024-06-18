

import { Button, CircularProgress } from "@mui/material"
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

const DownloadButton = ({ children, loading, title = 'Save', style, ...props }) => {
  return (
    <Button
      style={{ minWidth: 130, ...style }}
      startIcon={loading ? <CircularProgress size={14} style={{ color: '#fff' }} /> : <FileDownloadOutlinedIcon />}
      variant="outlined"
      {...props}
    >
      { title }
    </Button>
  )
}

export default DownloadButton
