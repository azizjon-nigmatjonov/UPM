import { Card } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import TabCounter from "../../../components/TabCounter";
import projectService from "../../../services/projectService";
import { pageToOffset } from "../../../utils/pageToOffset";
import { sortByOrderNumber } from "../../../utils/sortByOrderNumber";
import Table from "../Table";

export default function StatusesPage() {
  const [selectedTab, setSelectedTab] = useOutletContext(0);
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
  const [projects, setProjects] = useState({
    active: [],
    inactive: [],
  });
  const [loader, setLoader] = useState(true);

  const getProjects = () => {
    setLoader(true);
    const positionsData = {
      phase_id: null,
      limit: 1000,
      offset: pageToOffset(currentPage),
    };
    const statusesData = {
      limit: 1000,
      offset: pageToOffset(currentPage),
    };

    projectService
      .getProtectedList(
        location.pathname.includes("statuses") ? statusesData : positionsData
      )
      .then((res) => {
        setProjects({
          active: res.projects.filter((project) => project.active).sort(sortByOrderNumber),
          inactive: res.projects.filter((project) => !project.active).sort(sortByOrderNumber),
        });
      })
      .catch((error) => {
        console.log("ERROR ==>", error);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    getProjects();
  }, [currentPage]);

  return (
    <div className="StatusesPage">
      <Tabs
        direction={"ltr"}
        selectedIndex={selectedTab}
        onSelect={setSelectedTab}
      >
        <div style={{ padding: "20px" }}>
          <Card style={{ padding: "10px" }}>
            <TabList>
              <Tab>
                All{" "}
                <TabCounter
                  count={
                    projects?.active.length + projects?.inactive.length || 0
                  }
                />{" "}
              </Tab>
              <Tab>
                Active <TabCounter count={projects?.active.length || 0} />{" "}
              </Tab>
              <Tab>
                Inactive <TabCounter count={projects?.inactive.length || 0} />{" "}
              </Tab>
            </TabList>
            <TabPanel>
              <Table
                phaseId={null}
                selectedTab={null}
                activeProjects={projects.active}
                inactiveProjects={projects.inactive}
                allProjects={projects.active.concat(projects.inactive)}
                setProjects={setProjects}
                loader={loader}
                setLoader={setLoader}
                getProjects={getProjects}
                isDraggable
              />
            </TabPanel>
            <TabPanel>
              <Table
                phaseId={null}
                selectedTab={selectedTab}
                activeProjects={projects.active}
                allProjects={projects.active.concat(projects.inactive)}
                loader={loader}
                setLoader={setLoader}
                getProjects={getProjects}
              />
            </TabPanel>
            <TabPanel>
              <Table
                phaseId={null}
                selectedTab={selectedTab}
                inactiveProjects={projects.inactive}
                allProjects={projects.active.concat(projects.inactive)}
                loader={loader}
                setLoader={setLoader}
                getProjects={getProjects}
              />
            </TabPanel>
          </Card>
        </div>
      </Tabs>
    </div>
  );
}
