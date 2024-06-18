import { Delete } from "@mui/icons-material"
import { CircularProgress, IconButton } from "@mui/material"
import { format } from "date-fns/esm"
import { useMemo, useState } from "react"
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton"
import ButtonsPopover from "../../../components/ButtonsPopover"
import noteService from "../../../services/noteService"

const NoteRow = ({ note, selectedNote, openForm, removeNote }) => {
  const [loader, setLoader] = useState(false)

  const isActive = useMemo(() => {
    return selectedNote === note.id
  }, [selectedNote, note])

  const rowClickHandler = () => openForm(note.id)

  const deleteNote = () => {
    setLoader(true)

    noteService
      .delete(note.id)
      .then((res) => removeNote(note.id))
      .catch(() => setLoader(false))
  }

  return (
    <div
      onClick={rowClickHandler}
      className={`NoteRow silver-bottom ${isActive ? "active" : ""}`}
    >
      <div className="info">
        <div className="title">{note.title}</div>
        <div className="date">
          {format(new Date(note.created_at), "dd MMM yyyy")}
        </div>
      </div>
      <IconButton color="error" onClick={deleteNote}>
        {loader ? (
          <CircularProgress
            size={17}
            color={isActive ? "secondary" : "primary"}
          />
        ) : (
          <Delete />
        )}
      </IconButton>
      {/* <ButtonsPopover
        loading={loader}
        onDeleteClick={deleteNote}
        buttonProps={{ color: isActive ? "secondary" : "primary" }}
      /> */}
    </div>
  )
}

export default NoteRow
