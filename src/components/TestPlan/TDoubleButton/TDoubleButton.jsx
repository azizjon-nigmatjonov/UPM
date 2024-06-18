import React, {useState} from 'react';
import { Button, Popover, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import './styles.scss'
import { PlusOutlinedIcon } from '../../../assets/icons/icons';

export default function TDoubleButton({
  text = 'Button',
  icon = null,
  iconRight = null,
  color = '#0E73F6',
  bgColor = '#fff',
  height = '36px',
  width = 'auto',
  onSubmit=()=>{},
  setCreateTemplate,
  createTemplate,
  ...props
}) {
  
  const popoverStyles = makeStyles((theme) => ({
    root: {
      padding: '12px !important',
    },
    paper: {
      padding: '12px !important',
    }
  }))
  const useStyles = makeStyles((theme) => ({
    button: {
      backgroundColor: bgColor,
      '&:hover': {
        backgroundColor: bgColor,
      },
      color: color,
      height: height,
      width: width,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '0'
    },
    wrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyItems: 'flex-start',
      gap: '8px',
    },
    label: {
      fontFamily: 'Inter',
      fontWeight: '400',
      fontSize: '14px',
      lineHeight: '24px',
      height: '24px',
    },
  }));
  const classes = useStyles();
  const popClasses = popoverStyles();
  const [anchor, setAnchor] = useState(null)

  const handleClick = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  const open = Boolean(anchor);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <div className='buttonsWrapper'>
          <Button className={classes.button} onClick={(e) => {
                e.preventDefault();
                onSubmit();
              }}>
            <div className={classes.wrapper}>
              {icon}
              <p className={classes.label}>{text}</p>
            </div>
          </Button>
          <Button className={classes.button} onClick={handleClick}>
              {iconRight}
          </Button>
      </div>
      <Popover
        classes={{root: popClasses.root, paper: popClasses.paper}}
        id={id}
        open={open}
        anchorEl={anchor}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          columnGap: '6px',
          cursor: 'pointer'
        }}
        onClick={(e) => {
          e.preventDefault();
          onSubmit();
          setCreateTemplate(true)
        }}
        >
          <PlusOutlinedIcon />
          Create as a template
        </Box>
      </Popover>
    </>
  );
}
