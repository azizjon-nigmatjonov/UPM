import { CircularProgress } from "@mui/material"
import "./style.scss"

const RectangleIconButton = ({
  color,
  children,
  loader,
  size,
  onClick = () => {},
  ...props
}) => {
  return (
    <div
      className={`RectangleIconButton ${color} ${size}`}
      onClick={(e) => {
        e.stopPropagation()
        onClick(e)
      }}
      {...props}
    >
      {loader ? <CircularProgress size={14} /> : children}
    </div>
  )
}

export default RectangleIconButton
