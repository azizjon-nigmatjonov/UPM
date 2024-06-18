import { LocalizationProvider } from "@mui/lab";
import ThemeConfig from "../theme";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { enGB } from "date-fns/locale";

const MaterialUIProvider = ({children}) => {
  const theme = "light"

  return (
    <div className={theme === "dark" ? 'night-mode' : ''} >
      <ThemeConfig >
        <LocalizationProvider locale={enGB} dateAdapter={AdapterDateFns} >
          {children}
        </LocalizationProvider>
      </ThemeConfig>
    </div>
  );
};

export default MaterialUIProvider;
