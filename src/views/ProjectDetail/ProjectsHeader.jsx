import { useSelector } from "react-redux";
import { Link, NavLink, useParams } from "react-router-dom";
import Header from "../../components/Header";
import {
  DashboardOutlined,
  DescriptionOutlined,
  WaterfallChart,
  LowPriority,
  StickyNote2Outlined,
  AttachMoney,
  List,
  LibraryAddCheck
} from "@mui/icons-material";
import IconGenerator from "../../components/IconPicker/IconGenerator";
import PermissionWrapper from "../../components/PermissionWrapper";
import { memo } from "react";

const ProjectsHeader = ({ title = "", setTitle, ...props }) => {
  const { projectId } = useParams();

  const projectInfo = useSelector((state) => state.project.info);
  const taskTypeList = useSelector((state) => state.taskType.list);

  return (
    <Header
      title={
        <Link className="project-title" to={`/projects/${projectId}/info`}>
          {`${projectInfo?.title ?? ""} ${title}`}
        </Link>
      }
      backButtonLink={-1}
      {...props}
    >
      <PermissionWrapper permission="PROJECTS/DETAIL/DASHBOARD">
        <NavLink
          className="navbar-item"
          to={`/projects/${projectId}/dashboard`}
        >
          <DashboardOutlined className="navbar-item__icon" />
          Dashboard
        </NavLink>
      </PermissionWrapper>

      <PermissionWrapper permission="PROJECTS/DETAIL/BACKLOG">
        <NavLink className="navbar-item" to={`/projects/${projectId}/backlog`}>
          <LowPriority className="navbar-item__icon" />
          Backlog
        </NavLink>
      </PermissionWrapper>

      <PermissionWrapper permission="PROJECTS/DETAIL/BACKLOG">
        <NavLink className="navbar-item" to={`/projects/${projectId}/list`}>
          <List className="navbar-item__icon" />
          List view
        </NavLink>
      </PermissionWrapper>

      <PermissionWrapper permission="PROJECTS/DETAIL/BOARD">
        {taskTypeList?.map((type) => (
          <NavLink
            key={type.id}
            className="navbar-item"
            to={`/projects/${projectId}/board/${type.id}`}
          >
            <IconGenerator icon={type.icon} className="navbar-item__icon" />

            {type.title}
          </NavLink>
        ))}
      </PermissionWrapper>

      <PermissionWrapper permission="PROJECTS/DETAIL/GANTT">
        <NavLink className="navbar-item" to={`/projects/${projectId}/gantt`}>
          <WaterfallChart
            className="navbar-item__icon"
            style={{ transform: "rotate(90deg)" }}
          />
          Gantt chart
        </NavLink>
      </PermissionWrapper>

      <PermissionWrapper permission="PROJECTS/DETAIL/FILES">
        <NavLink
          className="navbar-item"
          to={`/projects/${projectId}/files/${projectInfo?.folder_id}`}
        >
          <DescriptionOutlined className="navbar-item__icon" />
          Docs
        </NavLink>
      </PermissionWrapper>

      <PermissionWrapper permission="PROJECTS/DETAIL/NOTES">
        <NavLink className="navbar-item" to={`/projects/${projectId}/note`}>
          <StickyNote2Outlined className="navbar-item__icon" />
          Notes
        </NavLink>
      </PermissionWrapper>
      {/* <PermissionWrapper permission="PROJECTS/DETAIL/PAYMENT"> */}
      <NavLink className="navbar-item" to={`/projects/${projectId}/payment`}>
        <AttachMoney className="navbar-item__icon" />
        Payment
      </NavLink>
      {/* </PermissionWrapper> */}
      <NavLink className="navbar-item" to={`/projects/${projectId}/test-plan`}>
        <LibraryAddCheck className="navbar-item__icon" />
        Test plan
      </NavLink>
    </Header>
  );
};

export default memo(ProjectsHeader);
