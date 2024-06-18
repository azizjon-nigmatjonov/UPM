import { useRef, useState } from "react"
import { LoadingButton } from "@mui/lab"
import fileService from "../../services/fileService"

const FileUploadButton = ({ folderId, onChange, variant="contained", text="Upload file", className = {} }) => {
  const inputRef = useRef()

  const [loader, setLoading] = useState(false)

  const onUpload = (e) => {
    setLoading(true)
    const file = e.target.files[0]

    const data = new FormData()
    data.append("file", file)

    fileService
      .createFile(folderId, data)
      .then((res) => {
        onChange(res)
      })
      .finally(() => setLoading(false))
  }

  return (
    <>
      <LoadingButton
        className={className}
        loading={loader}
        onClick={() => inputRef.current.click()}
        variant={variant}
        color="primary"
      >
        {text}
      </LoadingButton>
      <input style={{ display: 'none' }} onChange={onUpload} ref={inputRef} type="file" />
    </>
  )
}

export default FileUploadButton
