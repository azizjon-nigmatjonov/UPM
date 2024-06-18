import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import Header from "../../../components/Header"
import ProjectsHeader from "../../ProjectDetail/ProjectsHeader"
import MainInfoTab from "./MainInfoTab"
import MembersTab from "./Members"
import "./style.scss"

const ProjectForm = () => {
  return (
    <div className="ProjectForm">
      {/* <ProjectsHeader extra={null} /> */}
      <Tabs direction={"ltr"}>
        <Header style={{ paddingTop: 30 }}>
          <TabList>
            <Tab>Main information</Tab>
            <Tab>Members</Tab>
          </TabList>
        </Header>

        <TabPanel>
          <MainInfoTab />
        </TabPanel>
        <TabPanel>
          <MembersTab />
        </TabPanel>
      </Tabs>
    </div>
  )
}

export default ProjectForm
