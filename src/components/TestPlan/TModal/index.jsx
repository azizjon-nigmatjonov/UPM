import React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import TButton from '../TButton';
import { TextField } from '@mui/material';

export default function TModal({
  open,
  setOpen,
  values,
  title = 'Create New Folder',
  label = "Folder Name",
  cancelText = 'Cancel',
  okText = 'Create',
  onSubmit = () => {},
  onChange = () => {},
  handleReset = () => {}
}) {
  const handleClose = () => {
    handleReset()
    setOpen(false)
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: '500px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '6px',
    padding: '16px 0',
  };

  return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <form onSubmit={onSubmit}>
        <Box sx={style}>
          <div
            style={{
              borderBottom: '1px solid #E5E9EB',
              padding: '0 16px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontWeight: '600',
            }}
          >
            {title}
            <CloseRoundedIcon
              onClick={handleClose}
              sx={{ color: '#6E8BB7', cursor: 'pointer' }}
            />
          </div>
          <div
            style={{
              padding: '16px',
            }}
          >
              <div>
                <p style={{ marginBottom: '8px', fontWeight: '600' }}>
                 {label}
                </p>
                <TextField
                  name='title'
                  id='title'
                  onChange={onChange}
                  value={values.title}
                  fullWidth
                  size='small'
                  placeholder='Enter name'
                  autoFocus
                />
              </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'end',
              gap: '16px',
              padding: '0 16px 0 0',
            }}
          >
            <TButton
              text={cancelText}
              width='160px'
              height='36px'
              onClick={handleClose}
            />
            <TButton
              width='160px'
              height='36px'
              bgColor='#0E73F6'
              color='#fff'
              text={okText}
              onClick={(e) => {
                e.preventDefault();
                onSubmit();
              }}
              type="submit"
            />
          </div>
        </Box>
        </form>
      </Modal> )
}
