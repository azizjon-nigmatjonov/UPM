import HighlightOff from "@mui/icons-material/HighlightOff"
import { Button, IconButton, TextField, Typography } from "@mui/material"
import { format } from "date-fns"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import EditButton from "../../../components/Buttons/EditButton"
import SaveButton from "../../../components/Buttons/SaveButton"
import RingLoaderWithWrapper from "../../../components/Loaders/RingLoader/RingLoaderWithWrapper"
import Redactor from "../../../components/Redactor"
import UsersRow from "../../../components/UsersRow"
import noteService from "../../../services/noteService"
import { HTMLToMarkdown, markdownToHTML } from "../../../utils/markdownParser"

const NoteForm = ({
  selectedNote,
  closeForm,
  setCreatedNoteTitle,
  editNote,
  addNote,
  notesList,
}) => {
  const { projectId } = useParams()
  const selectedSprintId = useSelector(state => state.sprint.selectedSprintId)

  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [loader, setLoader] = useState(false)
  const [btnLoader, setBtnLoader] = useState(false)
  const [noteData, setNoteData] = useState(null)
  const [isEditable, setIsEditable] = useState(false)

  const fetchNoteData = () => {
    // setLoader(true)
    // noteService
    //   .getById(selectedNote)
    //   .then((res) => {
    //     setNoteData(res)
    //     setTitle(res.title)
    //     setMessage(res.message)
    //   })
    //   .finally(() => setLoader(false))
    const note = notesList.find(el => el.id === selectedNote)
    setNoteData(note)
    setTitle(note.title ?? '')
    // setMessage(markdownToHTML(note.message))
    setMessage(note.message ?? '')
  }

  const saveChanges = () => {
    setBtnLoader(true)

    const data = {
      id: selectedNote,
      // message: HTMLToMarkdown(message),
      message,
      title,
      project_id: projectId,
      sprint_id: selectedSprintId
    }
    noteService
      .update(data)
      .then((res) => {
        setIsEditable(false)
        editNote(res)
      })
      .finally(() => setBtnLoader(false))
  }

  const createNewNote = () => {
    setBtnLoader(true)

    const data = {
      // message: HTMLToMarkdown(message),
      message,
      title,
      project_id: projectId,
      sprint_id: selectedSprintId
    }
    noteService
      .create(data)
      .then((res) => {
        setIsEditable(false)
        addNote(res)
      })
      .finally(() => setBtnLoader(false))
  }

  const onSubmit = () => {
    if(selectedNote) saveChanges()
    else createNewNote()
  }

  const titleChangeHandler = (e) => {
    const val = e.target.value
    setTitle(val)
    if (!selectedNote) setCreatedNoteTitle(val)
  }

  const clearForm = () => {
    setTitle("")
    setMessage("")
    setNoteData(null)
  }

  useEffect(() => {
    clearForm()
    if (selectedNote) {
      fetchNoteData()
      setIsEditable(false)
    }
    else {
      setIsEditable(true)
      setLoader(false)
    }
  }, [selectedNote])

  if (loader)
    return (
      <div className="NoteForm">
        <RingLoaderWithWrapper />
      </div>
    )

  return (
    <div className="NoteForm">
      <div className="header silver-bottom-border">
        <div className="info-block">
          <div className="dates">
            {noteData && (
              <div className="date-block silver-right-border">
                <div className="label">Created</div>
                <div className="value">
                  {format(new Date(noteData?.created_at), "dd MMM")}
                </div>
              </div>
            )}
            <div className="date-block silver-right-border">
              <div className="label">Author</div>
              <div className="value">Zafar Khamidullaev</div>
            </div>
            <div className="date-block silver-right-border">
              <UsersRow />
            </div>
          </div>
        </div>

        <IconButton color="error" onClick={closeForm}>
          <HighlightOff fontSize="large" />
        </IconButton>
      </div>
              
      <div className="content-block">
        {!isEditable ? (
          <div className="title-row space-between">
            <Typography variant="h4">{title}</Typography>

            <EditButton color="warning" onClick={() => setIsEditable(true)}>
              Edit
            </EditButton>
          </div>
        ) : (
          <div className="form">
            <div className="title-row">
              <p className="label">TITLE: </p>
              <TextField
                autoFocus
                value={title}
                onChange={titleChangeHandler}
                fullWidth
                size="small"
              />
              <SaveButton loading={btnLoader} onClick={onSubmit} className="save-button" />
            </div>

            <Redactor value={message} onChange={setMessage} />
          </div>
        )}

        <div className="preview">
          <div dangerouslySetInnerHTML={{ __html: message }}></div>
        </div>
      </div>
    </div>
  )
}

export default NoteForm
