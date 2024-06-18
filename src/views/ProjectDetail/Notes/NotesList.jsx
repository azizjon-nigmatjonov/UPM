import { Collapse, Typography } from "@mui/material"
import { format } from "date-fns"
import CreateRowButton from "../../../components/CreateRowButton"
import RowLinearLoader from "../../../components/RowLinearLoader"
import NoteRow from "./NoteRow"

const NotesList = ({
  notesList,
  loader,
  selectedNote,
  formVisible,
  removeNote,
  openForm,
  createdNoteTitle,
}) => {

  return (
    <div className="NotesList silver-right-border">
      <div className="header silver-bottom-border">
        <Typography variant="h4">NOTES</Typography>
        <CreateRowButton onClick={() => openForm(null)} />
        <RowLinearLoader visible={loader} />
      </div>

      <div className="list">
        <Collapse in={formVisible && !selectedNote} >
          <div className={`NoteRow silver-bottom ${!selectedNote ? 'active' : ''}`}>
            <div className="info">
              <div className="title">{ createdNoteTitle || '-' }</div>
              <div className="date">{format(new Date(), "dd MMM yyyy")}</div>
            </div>
          </div>
        </Collapse>

        {notesList?.map((note) => (
          <NoteRow
            openForm={openForm}
            key={note.id}
            note={note}
            selectedNote={selectedNote}
            removeNote={removeNote}
          />
        ))}
      </div>
    </div>
  )
}

export default NotesList
