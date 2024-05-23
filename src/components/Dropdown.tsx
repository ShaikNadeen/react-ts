import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const BasicSelect = () => {
  const [country, setCountry] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setCountry(event.target.value as string);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl variant="outlined" fullWidth>
        <InputLabel id="demo-simple-select-label">Country</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={country}
          onChange={handleChange}
          label="Country"
        >
          <MenuItem value="">
            <em>Select a country</em>
          </MenuItem>
          <MenuItem value="usa">United States</MenuItem>
          <MenuItem value="canada">Canada</MenuItem>
          <MenuItem value="uk">United Kingdom</MenuItem>
          <MenuItem value="germany">Germany</MenuItem>
          <MenuItem value="france">France</MenuItem>
          <MenuItem value="japan">Japan</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default BasicSelect;