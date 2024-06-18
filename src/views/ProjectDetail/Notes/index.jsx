import { useEffect } from "react"
import { useState } from "react"
import { useSelector } from "react-redux"
import FiltersBlock from "../../../components/FiltersBlock"
import SprintSelect from "../../../components/Selects/SprintSelect"
import noteService from "../../../services/noteService"
import ProjectsHeader from "../ProjectsHeader"
import NoteForm from "./NoteForm"
import NotesList from "./NotesList"
import "./style.scss"

const NotesPage = () => {
  const selectedSprintId = useSelector(state => state.sprint.selectedSprintId)

  const [loader, setLoader] = useState(false)
  const [notesList, setNotesList] = useState([])
  const [selectedNote, setSelectedNote] = useState(null)
  const [formVisible, setFormVisible] = useState(false)
  const [createdNoteTitle, setCreatedNoteTitle] = useState("")

  const getNotesList = () => {
    setLoader(true)
    noteService
      .getList({ 'sprint-id': selectedSprintId })
      .then((res) => setNotesList(res.notes ?? []))
      .finally(() => setLoader(false))
  }

  const addNote = (note) => {
    setNotesList((prev) => [...prev, note])
    setSelectedNote(note.id)
  }

  const removeNote = (id) =>
    setNotesList((prev) => prev.filter((note) => note.id !== id))

  const editNote = (note) => {
    setNotesList((prev) => prev.map((el) => (el.id !== note.id ? el : note)))
  }

  const openForm = (id) => {
    setSelectedNote(id)
    setFormVisible(true)
    setCreatedNoteTitle('')
  }

  const closeForm = () => {
    setFormVisible(false)
    setSelectedNote(null)
    setCreatedNoteTitle('')
  }

  useEffect(() => {
    if(!selectedSprintId) return null
    getNotesList()
  }, [selectedSprintId])

  return (
    <div className="NotesPage">
      {/* <ProjectsHeader /> */}
      <FiltersBlock extra={[<SprintSelect />]} />

      <div className="main-area">
        <div className="card">
          <NotesList
            formVisible={formVisible}
            openForm={openForm}
            selectedNote={selectedNote}
            notesList={notesList}
            removeNote={removeNote}
            loader={loader}
            createdNoteTitle={createdNoteTitle}
          />
          {formVisible && (
            <NoteForm
              setCreatedNoteTitle={setCreatedNoteTitle}
              selectedNote={selectedNote}
              closeForm={closeForm}
              editNote={editNote}
              addNote={addNote}
              notesList={notesList}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default NotesPage
