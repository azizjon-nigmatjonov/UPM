import Header from "../../components/Header"
import Table from "./Table"
import { useNavigate } from "react-router-dom"
import CreateButton from "../../components/Buttons/CreateButton"

const SpheresPage = () => {
  const navigate = useNavigate()

  return (
    <div className="SpheresPage">
      <Header
        title='Spheres'
        extra={
          <CreateButton
            onClick={() => navigate(`/settings/spheres/create`)}
            title="Create sphere"
          />
        }
      />
      <div style={{ padding: "20px" }}>
        <Table />
      </div>
    </div>
  )
}

export default SpheresPage
