import { ContentCopy } from "@mui/icons-material";
import { useState } from "react";
import { useSelector } from "react-redux";
import RectangleIconButton from "../Buttons/RectangleIconButton";



const SprintCopyButton = ({ subtaskList }) => {
  const [isCopied, setIsCopied] = useState(false);
  const statusList = useSelector((state) => state.status.list)


  const onClick = () => {
    if(isCopied) return;

    let clipBoardText = ''
    subtaskList.forEach((subtask, index) => {
      const status = statusList.find(status => status.id === subtask.status_id)
      const subtaskString = `${index + 1}. ${subtask.task_title} > ${subtask.stage_title} > ${subtask.subtask_title} (${status?.title})`
      clipBoardText += subtaskString + '\n'
    })

    navigator.clipboard.writeText(clipBoardText)
    setIsCopied(true)

    setTimeout(() => {
      setIsCopied(false)
    }, 600)
  }

  return ( <RectangleIconButton onClick={onClick} size="long" color="primary" >
    <ContentCopy />
    {isCopied && 'Copied'}
  </RectangleIconButton> );
}
 
export default SprintCopyButton;