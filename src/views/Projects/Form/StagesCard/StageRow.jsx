import IconPicker from "../../../../components/IconPicker"

const StageRow = ({ stage }) => {
  return (
    <div className="GroupRow row">
      <IconPicker
        loading={false}
        value={stage.icon}
        disabled
      />
      <div className="title-block">{stage.title}</div>
    </div>
  )
}

export default StageRow
