import { Card } from "@mui/material";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import TabCounter from "../../../components/TabCounter";
import Table from "../Table"

export default function ProjectPositionsPage(){

  const phasesList = useSelector((state) => state.phase.phases)

  const [selectedTab, setSelectedTab] = useOutletContext(0)

  const allProjectsCount = useMemo(() => {
    let count = 0
    phasesList?.forEach((phase) => (count += phase.project_count ?? 0))
    return count
  }, [phasesList])
  return(
    <div className="ProjectPositionsPage">
      <Tabs
        direction={"ltr"}
        selectedIndex={selectedTab}
        onSelect={setSelectedTab}
      >
        <div style={{ padding: "20px" }}>
          <Card style={{ padding: "10px" }}>
            <TabList>
              <Tab>
                All <TabCounter count={allProjectsCount} />{" "}
              </Tab>
              {phasesList.map((phase) => (
                <Tab key={phase.id}>
                  {phase.title} <TabCounter count={phase.project_count} />{" "}
                </Tab>
              ))}
            </TabList>
            <TabPanel>
              <Table phaseId={null} isDraggable />
            </TabPanel>
            {phasesList.map((phase) => (
              <TabPanel key={phase.id}>
                <Table phaseId={phase.id} />
              </TabPanel>
            ))}
          </Card>
        </div>
      </Tabs>
    </div>
  )
}