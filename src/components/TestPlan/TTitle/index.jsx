import React from 'react';
import TCounter from '../TCounter';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { IconButton } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

export default function index({
  title,
  goBack = false,
  setSelectedCase = () => {},
  counter = { show: false },
  parentCreate = () => {},
  canCreate = false
}) {

  return (
    <div
      style={{
        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: 700,
        fontSize: '14px',
        lineHeight: '24px',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        color: '#303940',
        padding: '16px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      {goBack && (
        <ExpandMoreRoundedIcon
          onClick={() => setSelectedCase(null)}
          sx={{
            color: '#5B6871',
            transform: 'rotate(90deg)',
            cursor: 'pointer',
          }}
        />
      )}
      {title}
      {counter.show && <TCounter count={counter.count} />}
      {canCreate &&
      <IconButton onClick={parentCreate} size="small">
        <AddRoundedIcon sx={{ color: '#8D999F' }} />
      </IconButton>
      }
    </div>
  );
}
