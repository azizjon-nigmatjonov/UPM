import { Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
const SButton = ({
  children,
  loading,
  title = '',
  icon = false,
  variant = '',
  ...props
}) => {
  const useStyles = makeStyles((theme) => ({
    button: {
      backgroundColor: '#EAECF0',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start'
    },
    wrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyItems: 'flex-start',
      gap: '8px',
      fontFamily: 'Inter',
      fontWeight: '400',
      fontSize: '14px',
      lineHeight: '24px',
      height: '24px',
      padding: '0 8px',
    },
  }));
  const classes = useStyles();
  return (
    <Button className={classes.button} variant={variant} {...props}>
      <div className={classes.wrapper}>
        {icon}
        <p>{title}</p>
      </div>
    </Button>
  );
};

export default SButton;
