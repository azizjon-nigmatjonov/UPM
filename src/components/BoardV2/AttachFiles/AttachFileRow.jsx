import { useState } from 'react';
import subtaskService from '../../../services/subtaskService';
import useDownloader from '../../../hooks/useDownloader';
import { formatDistance } from 'date-fns';

const AttachFileRow = ({ subtaskId, file, removeFile, openFile }) => {
  const [loader, setLoader] = useState(false);
  const [download, downloadLoader] = useDownloader();

  const deleteHandler = () => {
    setLoader(true);

    subtaskService
      .deleteAttachFile(subtaskId, file.id)
      .then((res) => {
        removeFile(file.id);
      })
      .catch(() => setLoader(false));
  };

  const downloadHandler = () => {
    download({ fileId: file.id, fileName: file.name });
  };

  const openHandler = () => {
    openFile(file);
  };

  const countTime = (date) => {
    const time = formatDistance(new Date(date), new Date(), {
      addSuffix: true,
    });

    return time;
  };

  return (
    <div className='space-left attachments'>
      <img
        style={{ cursor: 'pointer' }}
        onClick={openHandler}
        src={`${process.env.REACT_APP_CDN_API_URL}/file/${file.id}`}
      />
      <div className='info'>
        <span>{file.name.slice(0, 15)}{file.name.length > 15 && "..."}</span>
        <div className='col'>
          <span>
            Added &nbsp;
            {countTime(file.created_at)}
          </span>
          &nbsp;&nbsp;
          <a onClick={() => downloadHandler(file)}>Download</a> &nbsp;&nbsp;
          <a onClick={() => deleteHandler(file)}>Delete</a>
        </div>
      </div>
    </div>
  );
};

export default AttachFileRow;
