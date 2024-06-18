import React from 'react';
import { Button } from '@mui/material';
import { makeStyles } from '@mui/styles';

export default function TButton({
  text = 'Button',
  icon = null,
  color = '#0E73F6',
  bgColor = '#fff',
  height = '36px',
  width = 'auto',
  ...props
}) {
  const useStyles = makeStyles((theme) => ({
    button: {
      backgroundColor: bgColor,
      '&:hover': {
        backgroundColor: bgColor,
      },
      color: color,
      height: height,
      width: width,
      border: '1px solid #E5E9EB',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px 16px',
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

  return (
    <Button className={classes.button} {...props}>
      <div className={classes.wrapper}>
        {icon}
        <p className={classes.label}>{text}</p>
      </div>
    </Button>
  );
}
