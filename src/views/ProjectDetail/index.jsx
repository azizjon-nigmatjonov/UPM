import { useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useLocation, useParams } from "react-router-dom"
import { getEpicListAction } from "../../redux/thunks/epic.thunk"
import {
  fetchAllProjectDetails,
  resetAllProjectDetails,
} from "../../redux/thunks/project.thunk"
import "./index.scss"
import ProjectsHeader from "./ProjectsHeader"

const ProjectDetail = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const { projectId } = useParams()

  const selectedVersion = useSelector(
    (state) => state.version.selectedVersionId
  )

  const isHeaderVisisble = useMemo(() => {
    if(location.pathname.includes('sprint')) return false
    return true
  }, [location.pathname])

  useEffect(() => {
    dispatch(fetchAllProjectDetails(projectId))
  }, [dispatch, projectId])

  useEffect(() => {
    return () => {
      dispatch(resetAllProjectDetails())
    }
  }, [])
  
  useEffect(() => {
    if(!selectedVersion) return null
    dispatch(getEpicListAction())
  }, [selectedVersion, dispatch])

  return (
    <div className="ProjectDetail">
      {isHeaderVisisble && <ProjectsHeader  />}
      <Outlet />
    </div>
  )
}

export default ProjectDetail
