import BackButton from "../BackButton"
import RowLinearLoader from "../RowLinearLoader"
import "./style.scss"
import { NavLink } from "react-router-dom";
import { useLocation } from 'react-router-dom'

const Header = ({ title = "", extra, children, loader, backButtonLink,  ...props }) => {
  const location = useLocation();
  const {pathname} = location;
  
  const pathLocation = pathname.split("/");
  return (
    <div className="Header silver-bottom-border" {...props} >
      <div className="left-side">
        {backButtonLink && <BackButton link={backButtonLink} />}
        {title && <div className="header-title">{ title }</div>}
        {pathLocation[2] === 'statuses' || pathLocation[2] === 'positions' ?
         <div className="header_tab">
         <NavLink
         to=''
         exact
        //  activeClassName='active'
         >
           <div className={`header_tabLink ${
            pathLocation[2] === 'statuses' ? 'active' : ''
           }`}>
           Statuses
           </div>
         </NavLink>
         <NavLink
         to='/projects/positions'
          // activeClassName='active'
         >
           <div className={`header_tabLink ${
            pathLocation[2] === 'positions' ? 'active' : ''}`}>
           Positions
           </div>
         </NavLink>
       </div> 
       : pathLocation[1] === 'standups' ? 
       <div className="header_tab">
       <NavLink
       to='/standups'
       exact
       >
         <div className={`header_tabLink ${
          pathLocation?.length === 2 ? 'active' : ''
         }`}>
         Projects
         </div>
       </NavLink>
       <NavLink
       to='/standups/report'
        // activeClassName='active'
       >
         <div className={`header_tabLink ${
          pathLocation?.length === 3 ? 'active' : ''}`}>
            Report
         </div>
       </NavLink>
     </div> : ''  
      }
       
        <div className="content">
          {children}
        </div>
      </div>
      <div className="extra" >
        {extra}
      </div>
      <RowLinearLoader visible={loader} />
    </div>
  )
}

export default Header
