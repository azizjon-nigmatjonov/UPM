import ColorPicker from "../../../../components/ColorPicker"

const StatusRow = ({ status }) => {
  return (
    <>
      <div className="StatusRow silver-bottom-border pointer">
        <ColorPicker value={status.color} loading={false} disabled />
        <div className="label">{status.title}</div>
      </div>
    </>
  )
}

export default StatusRow
