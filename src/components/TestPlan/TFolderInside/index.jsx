import './style.scss';
import React, { useState } from 'react';
import TBaseRow from '../TBaseRow';
import TRow from '../TRow';
import TTitle from '../TTitle';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useMutation } from '@apollo/client';
import { COPY_FOLDERS, DELETE_FOLDERS } from '../../../apollo/requests/folders/folders';
import { arrayOfIds } from '../../../utils/arrayOfIds';
import TSelectFolder from '../TSelectFolder';

export default function TFolderInside({
  folder,
  handleCreate,
  setSelected,
  getFolders = () => {},
}) {
  const [selectModal, setModal] = useState(false)
  const [selectedFolders, setSelectedFolders] = useState([]); // select folders for actions
  const [destination, setDestination] = useState({})
  const [deleteFolders] = useMutation(DELETE_FOLDERS);
  const [copyFolders] = useMutation(COPY_FOLDERS)

  const onDelete = () => {
    deleteFolders({
      variables: {
        ids: arrayOfIds(selectedFolders),
      },
    }).then(() => {
      setSelected([]);
      getFolders();
    });
  };

  const onCopy = () => {
    destination.id && copyFolders({
      variables: {
        ids: arrayOfIds(selectedFolders),
        parent_folder_id: destination.id
      }
    }).then(() => {
      getFolders()
      setModal(false)
      setSelected([])
    })
  };

  const handleCopy = () => setModal(true)

  return (
    <div>
      <TTitle title={folder?.title} />
      <div className='main-area'>
        <TBaseRow
          folder={folder}
          title='Subfolders'
          selectedFolders={selectedFolders}
          setSelectedFolders={setSelectedFolders}
          onCopy={handleCopy}
          onDelete={onDelete}
        />
        <div className='scrollable'>
          {folder?.child_folders?.map((folder) => (
            <TRow
              key={folder.id}
              folder={folder}
              setSelected={setSelected}
              selectedFolders={selectedFolders}
              setSelectedFolders={setSelectedFolders}
            />
          ))}
          <div className='add-btn'>
            <Button
              startIcon={<AddIcon />}
              onClick={() => handleCreate(folder)}
            >
              Create
            </Button>
          </div>
        </div>
      </div>

      {selectModal && (
        <TSelectFolder
          open={selectModal}
          setOpen={setModal}
          title='Choose destination folder'
          okText='Confirm'
          selected={destination}
          setSelected={setDestination}
          onSubmit={onCopy}
        />
      )}
    </div>
  );
}
