import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Header from "../../../../../components/Header"
import integrationService from "../../../../../services/integrationService"
import SessionCreateForm from "./Form"
import "./style.scss"
import SessionsTable from "./Table"
import TokenModal from "./TokenModal"

const SessionsPage = () => {
  const { integrationId } = useParams()

  const [tableData, setTableData] = useState(null)
  const [selectedSessionId, setSelectedSessionId] = useState(null)
  const [loader, setLoader] = useState(true)

  const fetchTableData = () => {
    setLoader(true)
    integrationService
      .getSessionsList(integrationId)
      .then((res) => {
        setTableData(
          res.sessions?.map((session) => ({
            ...session,
            data: session.data ? JSON.parse(session.data) : {},
          })) ?? []
        )
      })
      .finally(() => setLoader(false))
  }

  const deleteTableData = (id) => {
    return () => {
      setLoader(true)

      integrationService
        .deleteSession(integrationId, id)
        .then((res) => {
          setTableData((prev) => prev.filter((el) => el.id !== id))
        })
        .finally(() => setLoader(false))
    }
  }

  const addTableData = (data) => {
    setTableData(prev => [...prev, data])
  }

  const closeModal = () => setSelectedSessionId(null)

  useEffect(() => {
    fetchTableData()
  }, [])

  return (
    <div className="SessionsPage">
      <Header title="Sessions" backButtonLink />

      <div className="main-block p-2">
        <SessionCreateForm addSession={addTableData} />

        <SessionsTable
          tableData={tableData}
          deleteTableData={deleteTableData}
          loader={loader}
          setSelectedSessionId={setSelectedSessionId}
        />
      </div>

      {selectedSessionId && <TokenModal closeModal={closeModal} sessionId={selectedSessionId} />}

    </div>
  )
}

export default SessionsPage
