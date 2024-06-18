import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

const AboutPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    navigate(`/projects/${id}/backlog`)
  }, [])

  return null
}

export default AboutPage
