import { useLocation, useNavigate } from "react-router-dom"
import CreateButton from "../../../components/Buttons/CreateButton"
import Header from "../../../components/Header"
import MembersGroupTable from "./Table"

const MembersPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  
  return (
    <div className="MembersPage">
      <Header
        title="Members"
        extra={
          <CreateButton
            onClick={() => navigate(`${location.pathname}/create`)}
            title="Add member"
          />
        }
      />
       <div style={{ padding: "20px" }}>
         <MembersGroupTable />
      </div>
    </div>
  )
}

export default MembersPage
