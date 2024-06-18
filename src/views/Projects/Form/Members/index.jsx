import { Card } from "@mui/material"
import { useEffect, useMemo } from "react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import CreateButton from "../../../../components/Buttons/CreateButton"
import RingLoaderWithWrapper from "../../../../components/Loaders/RingLoader/RingLoaderWithWrapper"
import projectMembersGroupService from "../../../../services/projectMembersGroupService"
import MembersAddModal from "./MembersAddModal"
import MembersGroupTable from "./Table"

const MembersTab = () => {
  const { projectId } = useParams()
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedTab, setSelectedTab] = useState(0)
  const [counter, setCounter] = useState(false)

  const openModal = () => setModalVisible(true)
  const closeModal = () => setModalVisible(false)

  const [groupsList, setGroupsList] = useState([])
  const [loader, setLoader] = useState(true)

  const membersGroupId = useMemo(() => {
    return groupsList[selectedTab]?.id
  }, [groupsList, selectedTab])

  const getGroupsList = () => {
    setLoader(true)

    projectMembersGroupService
      .getList({
        "project-id": projectId,
      })
      .then((res) => setGroupsList(res.project_member_groups ?? []))
      .finally(() => setLoader(false))
  }

  const addMember = () => setCounter((prev) => prev + 1)

  useEffect(() => {
    getGroupsList()
  }, [])

  return (
    <div className="MembersTab">
      {modalVisible && (
        <MembersAddModal
          closeModal={closeModal}
          membersGroupId={membersGroupId}
          addMember={addMember}
        />
      )}
      <Card
        style={{
          paddingTop: 0,
          margin: 20,
          padding: "10px 20px 20px 20px",
          position: "relative",
        }}
      >
        {loader ? (
          <RingLoaderWithWrapper />
        ) : (
          <Tabs
            direction={"ltr"}
            selectedIndex={selectedTab}
            onSelect={setSelectedTab}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <TabList style={{ marginBottom: 0 }}>
                {groupsList?.map((group) => (
                  <Tab key={group.id}>{group.title}</Tab>
                ))}
              </TabList>

              <CreateButton title="Add new member" onClick={openModal} />
            </div>

            {groupsList?.map((group) => (
              <TabPanel key={group.id}>
                <MembersGroupTable
                  membersGroupId={group.id}
                  counter={counter}
                />
              </TabPanel>
            ))}
          </Tabs>
        )}
      </Card>
    </div>
  )
}

export default MembersTab
