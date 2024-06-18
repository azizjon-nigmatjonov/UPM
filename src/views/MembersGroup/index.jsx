import { useLocation, useNavigate } from "react-router-dom"
import CreateButton from "../../components/Buttons/CreateButton"
import Header from "../../components/Header"
import ProjectsHeader from "../ProjectDetail/ProjectsHeader"
import MembersGroupTable from "./Table"

const MembersGroupPage = () => {
  const navigate = useNavigate()
  const location = useLocation()


  return (
    <div className="MembersGroupPage">
      <Header
        title="Members group"
        extra={
          <CreateButton
            onClick={() => navigate(`${location.pathname}/create`)}
            title="Create members group"
          />
        }
      />
       <div style={{ padding: "20px" }}>
         <MembersGroupTable />
      </div>
    </div>
  )
}

export default MembersGroupPage
