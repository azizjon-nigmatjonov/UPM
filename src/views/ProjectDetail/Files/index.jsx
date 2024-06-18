import React, { Suspense } from "react"
import "./style.scss"
import { useNavigate, useParams } from "react-router-dom"
import SafeComponent from "../../../components/SafeComponent"
// import ProjectsHeader from "../ProjectsHeader"
// import FallbackPage from "../../Fallback"
const FileSystemModule = React.lazy(() => import("fileSystem/FileSystemModule"))

const ProjectFiles = () => {
  const navigate = useNavigate()
  const { projectId, folderId } = useParams()

  const setFolderId = (id) => {
    navigate(`/projects/${projectId}/files/${id}`)
  }

  return (
    <div className="ProjectFiles">
      {/* <ProjectsHeader /> */}
      <SafeComponent>
        <Suspense fallback={<div>Loading....</div>}>
          <FileSystemModule folderId={folderId} setFolderId={setFolderId} />
        </Suspense>
      </SafeComponent>
    </div>
  )
}

export default ProjectFiles
