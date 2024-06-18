import React, { createContext, useEffect, useState } from "react";
import "./style.scss";

import Define from "../../components/TestPlan/Define/Define";
import TestSide from "../../components/TestPlan/TestSide/TestSide";
import { Tab, TabList, Tabs, TabPanel } from "react-tabs";
import Folder from "@mui/icons-material/Folder";
import PieChartIcon from "@mui/icons-material/PieChart";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import TestRun from "../../components/TestPlan/TestRun/TestRun";
import projectTestService from "../../services/projectTestService";
import CaseTemplate from "../../components/TestPlan/CaseTemplate/CaseTemplate";
import { useQuery } from "@apollo/client";
import { GET_CASE_STEP_TEMPLATE_LIST } from "../../apollo/requests/case-step-template/case-step-template";

export const TestContext = createContext();

export default function TestPlan() {
  const [searchParams, setSearchParams] = useSearchParams({ tab: 0 });
  const tab = searchParams.get("tab");
  const [createTemplate, setCreateTemplate] = useState(false);
  const [isTemplate, setIsTemplate] = useState(false);

  const [tabIndex, setTabIndex] = useState(Number(tab));
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [folders, setFolders] = useState([]);

  function handleRouteActions(index) {
    setTabIndex(index);
    if (!index) navigate(`/projects/${projectId}/test-plan/`);
  }

  const [templateItems, setTemplateItems] = useState([]);
  const getTestItems = () => {
    projectTestService
      .getList({
        project_id: projectId,
        limit: 1000,
        offset: 0,
        is_template: true,
      })
      .then((res) => {
        setTemplateItems(res.Tests);
        if (res.Tests.length > 0) {
          setIsTemplate(true);
        }
      });
  };
  const { loading, refetch } = useQuery(GET_CASE_STEP_TEMPLATE_LIST, {
    variables: {
      input: {
        offset: 0,
        limit: 100,
        search: "",
      },
    },
    onCompleted: ({ getCaseStepTemplateList }) => {
      setFolders(getCaseStepTemplateList);
    },
  });

  useEffect(() => {
    getTestItems();
  }, []);

  const handleCreateTestTemplate = (item) => {
    const data = {
      creator_id: item?.creator?.id,
      is_template: false,
      name: item.name,
      project_id: item.project_id,
      full_case: "all",
    };
    projectTestService.create(data);
  };
  return (
    <div className="TestPlan">
      <div className="TTab">
        <TestContext.Provider value={{ createTemplate, setCreateTemplate }}>
          <Tabs
            selectedIndex={tabIndex}
            onSelect={(index) => {
              handleRouteActions(index);
              setSearchParams({ tab: index });
            }}
          >
            <TabList>
              <Tab className="ttab">
                <div className="with-icon">
                  <Folder /> Define
                </div>
              </Tab>
              <Tab className="ttab">
                <div className="with-icon">
                  <PieChartIcon /> Test
                </div>
              </Tab>
              {isTemplate && (
                <Tab className="ttab">
                  <div className="with-icon">
                    <PieChartIcon /> Test run templates
                  </div>
                </Tab>
              )}

              <Tab className="ttab">
                <div onClick={() => refetch()} className="with-icon">
                  <PieChartIcon /> Action word
                </div>
              </Tab>
            </TabList>
            <TabPanel>
              <Define />
            </TabPanel>
            <TabPanel>
              <TestSide />
            </TabPanel>
            {isTemplate && (
              <TabPanel>
                <TestRun
                  handleCreateTestTemplate={handleCreateTestTemplate}
                  templateItems={templateItems}
                />
              </TabPanel>
            )}
            <TabPanel>
              <CaseTemplate
                loading={loading}
                refetch={refetch}
                folders={folders}
              />
            </TabPanel>
          </Tabs>
        </TestContext.Provider>
      </div>
    </div>
  );
}
