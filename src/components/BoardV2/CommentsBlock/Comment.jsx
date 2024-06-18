import { format } from "date-fns"
import { useEffect, useMemo } from "react"
import ButtonsPopover from "../../ButtonsPopover"
import RowLinearLoader from "../../RowLinearLoader"
import UserAvatar from "../../UserAvatar"

const Comment = ({
  comment,
  deleteComment = () => {},
  setSelectedComment,
  selectedComment,
  scrollBottomRightSide,
  userId,
}) => {

  const isOwnComment = useMemo(() => {
    return comment.creator_id === userId
  }, [userId, comment.creator_id])

  const onDeleteClick = () => {
    deleteComment(comment.id)
  }

  const onEditClick = () => {
    setSelectedComment(comment)
  }

  const isActive = useMemo(() => {
    return selectedComment?.id === comment.id
  }, [selectedComment, comment.id])

  useEffect(() => {
    if (comment.loader) scrollBottomRightSide()
  }, [])



  return (
    <div className={`CommentMain ${isOwnComment ? "" : "reverse"}`} >
      <UserAvatar
        disableTooltip
        user={{ photo_url: comment.creator_photo, name: comment.creator_name }}
      />
      <div className="Block">
        <p className="username">{comment.creator_name}</p>
        <div className={`Comment ${isActive ? "active" : ""} ${isOwnComment ? "own-comment" : ""}`}>
        <div className="text">{comment.message}</div>
      {!isActive && isOwnComment && (
        <div>
          <ButtonsPopover
            onDeleteClick={onDeleteClick}
            onEditClick={onEditClick}
            loading={comment.loader}
          />
        </div>
      )}
        </div>
      </div>
      <RowLinearLoader />
    </div>
  )
}

export default Comment
