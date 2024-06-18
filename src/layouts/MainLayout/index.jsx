import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { Outlet } from "react-router-dom"
import Sidebar from "../../components/Sidebar"
import { fetchPhasesList } from "../../redux/thunks/project.thunk"
import "./style.scss"

const MainLayout = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchPhasesList())
  }, [])

  return (
    <div className="MainLayout" >
      <Sidebar />
      <div className="content-side">
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout
