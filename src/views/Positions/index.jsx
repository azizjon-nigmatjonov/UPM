import Header from "../../components/Header"
import Table from "./Table"
import { useNavigate } from "react-router-dom"
import CreateButton from "../../components/Buttons/CreateButton"
import PermissionWrapper from "../../components/PermissionWrapper"

const PositionsPage = () => {
  const navigate = useNavigate()

  return (
    <div className="PositionsPage">
      <Header
        title="Positions"
        extra={
          <PermissionWrapper permission="SETTINGS/POSITIONS/CREATE">
            <CreateButton
              onClick={() => navigate(`/settings/positions/create`)}
              title="Create position"
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

export default PositionsPage
