import { Search } from '@mui/icons-material';
import { InputAdornment, TextField } from '@mui/material';

const SearchInput = ({ onChange, icon = false, ...props }) => {
  return (
    <TextField
      size='small'
      placeholder='Search...'
      onChange={(e) => onChange(e.target.value)}
      {...props}
      InputProps={{
        startAdornment: (
          <InputAdornment style={{}}>
            {icon && <Search sx={{ color: '#0E73F6' }} />}
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchInput;
