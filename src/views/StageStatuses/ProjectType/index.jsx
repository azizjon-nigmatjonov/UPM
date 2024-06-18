import { useEffect, useState } from "react"
import TypeRow from "./TypeRow"
import FormCard from "../../../components/FormCard"
import RingLoaderWithWrapper from "../../../components/Loaders/RingLoader/RingLoaderWithWrapper"
import TitleCreateForm from "../../../components/CreateForms/TitleCreateForm"
import projectService from "../../../services/projectService"

const ProjectTypes = () => {
  const [projectTypes, setProjectTypes] = useState([])
  const [loader, setLoader] = useState(false)
  const [createLoader, setCreateLoader] = useState(false)
  const [createFormVisible, setCreateFormVisible] = useState(false)

  const getProjectTypes = () => {
    setLoader(true)
    projectService
      .getProjectTypes()
      .then((res) => {
        setProjectTypes(res?.items || [])
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setLoader(false))
  }

  const closeCreateForm = () => setCreateFormVisible(false)

  useEffect(() => {
    getProjectTypes()
  }, [])

  const createType = ({ title }) => {
    setCreateLoader(true)
    const data = {
      title,
      color: '#0452C8'
    }

    projectService
      .createProjectType(data)
      .then((res) => {
        getProjectTypes()
        closeCreateForm()
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setCreateLoader(false))
  }

  return (
    <div>
      <FormCard visible title="Project Types">
        {loader ? (
          <RingLoaderWithWrapper />
        ) : (
          <div className="StatusGroup silver-bottom-border">
            <div className="status-list">
              {projectTypes?.map((type) => (
                <TypeRow
                  key={type.id}
                  type={type}
                  getProjectTypes={getProjectTypes}
                />
              ))}
            </div>
            <TitleCreateForm
              formVisible={createFormVisible}
              setFormVisible={setCreateFormVisible}
              loader={createLoader}
              onSubmit={createType}
              closeForm={closeCreateForm}
              title="Create new type"
            />
          </div>
        )}
      </FormCard>
    </div>
  )
}

export default ProjectTypes
