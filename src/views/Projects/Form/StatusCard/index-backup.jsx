import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import FormCard from "../../../../components/FormCard"
import projectTaskTypeService from "../../../../services/projectTaskTypeService"
import statusService from "../../../../services/statusService"
import StatusTab from "./StatusTab"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"

import "./style.scss"
import TitleCreateForm from "../../../../components/CreateForms/TitleCreateForm"
import { Add } from "@mui/icons-material"
import { useDispatch, useSelector } from "react-redux"
import { projectActions } from "../../../../redux/slices/project.slice"
import CreateRowButton from "../../../../components/CreateRowButton"

const StatusCard = () => {
  const { projectId } = useParams()
  const dispatch = useDispatch()

  const statusList = useSelector((state) => state.status.list)
  const typeList = useSelector((state) => state.taskType.list)

  const [createLoader, setCreateLoader] = useState(false)
  const [createFormVisible, setCreateFormVisible] = useState(false)

  const addStatus = (status) => {
    dispatch(projectActions.addStatus(status))
  }

  const deleteStatus = (id) => {
    dispatch(projectActions.deleteStatus(id))
  }

  const editStatus = (id, title) => {
    dispatch(projectActions.editStatus({ id, title }))
  }

  const addType = ({ title }) => {
    setCreateLoader(true)
    projectTaskTypeService
      .create({
        project_id: projectId,
        title,
      })
      .then((res) => dispatch(projectActions.addTaskType(res)))
      .finally(() => setCreateLoader(false))
  }

  const computedTypes = useMemo(() => {
    if (!statusList?.length) return typeList

    return typeList.map((type) => ({
      ...type,
      statuses: statusList.filter(
        (status) => status.project_task_type_id === type.id
      ),
    }))
  }, [statusList, typeList])
  
  return (
    <FormCard visible title="Statuses">

    </FormCard>
  )

  // return (
  //   <div>
  //     <FormCard visible title="Statuses">
  //       <Tabs direction={'ltr'} >
  //           <TabList>
  //             {computedTypes.map((type) => (
  //               <Tab key={type.id} >{type.title}</Tab>
  //             ))}
  //             <Tab> <Add /> Add status types</Tab>
  //           </TabList>

  //         {computedTypes.map((type) => (
  //           <TabPanel key={type.id} >
  //             <StatusTab key={type.id} type={type} addStatus={addStatus} deleteStatus={deleteStatus} editStatus={editStatus} />
  //           </TabPanel>
  //         ))}

  //         <TabPanel>
  //           <TitleCreateForm loader={createLoader} onSubmit={addType} />
  //         </TabPanel>

  //       </Tabs>
  //     </FormCard>
  //   </div>
  // )
}

export default StatusCard
