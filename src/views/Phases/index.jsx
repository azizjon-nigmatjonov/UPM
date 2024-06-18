import Header from "../../components/Header"
import Table from "./Table"
import { useNavigate } from "react-router-dom"
import CreateButton from "../../components/Buttons/CreateButton"
import PermissionWrapper from "../../components/PermissionWrapper"

const PhasesPage = () => {
  const navigate = useNavigate()

  return (
    <div className="ProjectsPage">
      <Header
        title="Phases"
        extra={
          <PermissionWrapper permission="SETTINGS/PHASES/CREATE">
            <CreateButton
              onClick={() => navigate(`/settings/phases/create`)}
              title="Create phase"
            />
          </PermissionWrapper>
        }
      />
      <div style={{ padding: "20px" }}>
        <Table />
      </div>
    </div>
  )
}

export default PhasesPage
