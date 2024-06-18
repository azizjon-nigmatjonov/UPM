import Header from "../../components/Header";
import { Outlet, useNavigate } from "react-router-dom";
import CreateButton from "../../components/Buttons/CreateButton";
import { useSelector } from "react-redux";
import { useState } from "react";
import PermissionWrapper from "../../components/PermissionWrapper";

const ProjectsPage = () => {
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState(1);

  const phasesList = useSelector((state) => state.phase.phases);
  const navigateToCreateForm = () => {
    navigate(`/projects/phase/${phasesList?.[selectedTab]?.id}/create`);
  };

  return (
    <div className="ProjectsPage">
      <Header
        title="Projects"
        extra={
          <PermissionWrapper permission="PROJECTS/CREATE">
            <CreateButton
              onClick={navigateToCreateForm}
              title="Create project"
            />
          </PermissionWrapper>
        }
      />
      <Outlet context={[selectedTab, setSelectedTab]} />
    </div>
  );
};

export default ProjectsPage;
