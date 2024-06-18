import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted"
import FolderOpenIcon from "@mui/icons-material/FolderOpen"
import Select from 'react-select'
import "./style.scss"


const SprintSubtasksListType = ({ listType, setListType }) => {
  
  const options = [
    { label: 'List view', value: 'list', 
  icon: <FormatListBulletedIcon className="icon" /> },
    { label: 'Group by type', value: 'group', 
    icon: <FolderOpenIcon className="icon" /> },
    { label: 'Group by task', value: 'groupByTask', 
    icon: <FolderOpenIcon className="icon" /> },
    { label: 'Group by stage', value: 'groupByStage', 
    icon: <FolderOpenIcon className="icon" /> },
  ]
  
  const customStyles = {
    control: (base, state) => ({
      ...base,
      background: "#F6F8F9",
      borderRadius: "6px",
      width: "200px",
      borderColor: state.isFocused ? "#cccc" : "#ccc",
      boxShadow: state.isFocused ? null : null,
      "&:hover": {
        borderColor: state.isFocused ? "#ccc" : "#ccc"
      }
    }), 
    dropdownIndicator: base => ({
      ...base,
      "&:hover": {
        color: "#0E73F6"
      },
      color: "#0E73F6", // Custom colour
      fontSize: '12px'
    }),
    
  };
  
  
  return (
    <div className="SprintSubtasksListType">
      <Select
        defaultValue={options[0]}
        options={ options }
        styles={customStyles}
        getOptionLabel={e => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {e.icon}
            <span style={{ marginLeft: 5 }}>{e.label}</span>
          </div>
        )}
        components={{
          IndicatorSeparator: () => null
        }}
        onChange={(e) => setListType(e.value)}
      />
    </div>
  )
}

export default SprintSubtasksListType
