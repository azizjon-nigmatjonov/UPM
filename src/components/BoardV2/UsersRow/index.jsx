import { useMemo } from 'react';
import UserAvatar from '../UserAvatar';
import './style.scss';
import AddIcon from '@mui/icons-material/Add';

const UsersRow = ({ size, assigneeUsers = [], onAddButtonClick }) => {
  const computedList = useMemo(() => {
    if (assigneeUsers?.length < 4) return assigneeUsers;
    return assigneeUsers?.slice(0, 4);
  }, [assigneeUsers]);

  return (
    <div className='UsersRowNew'>
      {onAddButtonClick && (
        <UserAvatar
          onClick={onAddButtonClick}
          innerText={<AddIcon sx={{ color: '#6F7B8F' }} />}
          size={size}
        />
      )}
      {assigneeUsers?.length > 4 && (
        <UserAvatar innerText={`+${assigneeUsers?.length - 4}`} size={size} />
      )}
      {computedList?.map((user) => (
        <UserAvatar key={user.id} user={user} size={size} />
      ))}
    </div>
  );
};

export default UsersRow;
