import { useNavigate } from "react-router-dom";
import { Container, Draggable } from "react-smooth-dnd";
import ButtonsPopover from "../../components/ButtonsPopover";
import EmptyDataComponent from "../../components/EmptyDataComponent";
import RingLoaderWithWrapper from "../../components/Loaders/RingLoader/RingLoaderWithWrapper";
import LogoDisplay from "../../components/LogoDisplay";
import projectService from "../../services/projectService";
import { applyDrag } from "../../utils/applyDrag";
import { TableChart } from "../../assets/icons/icons";
import "./style.scss";

const ProjectsTable = ({
  loader = false,
  activeProjects = [],
  inactiveProjects = [],
  allProjects = [],
  setLoader = () => {},
  setProjects = () => {},
  getProjects = () => {},
  isDraggable,
}) => {
  const navigate = useNavigate();

  const deleteTableData = (e, id) => {
    setLoader(true);

    projectService
      .delete(id)
      .then((res) => {
        getProjects();
      })
      .catch(() => setLoader(false));
  };

  const navigateToEditForm = (e, id) => {
    navigate(`/projects/${id}/info`);
  };

  const onDropActive = (dropResult) => {
    const result = applyDrag(activeProjects, dropResult);
    if (result) {
      setProjects({ active: result, inactive: inactiveProjects });
      updateOrder(dropResult);
    }
  };

  const onDropInactive = (dropResult) => {
    const result = applyDrag(inactiveProjects, dropResult);
    if (result) {
      setProjects({ active: activeProjects, inactive: result });
      updateOrder({
        removedIndex:
          dropResult.removedIndex +
          (allProjects.length - inactiveProjects.length),
        addedIndex:
          dropResult.addedIndex +
          (allProjects.length - inactiveProjects.length),
      });
    }
  };

  const updateOrder = ({ removedIndex, addedIndex }) => {
    projectService.updateOrder(allProjects[removedIndex].id, addedIndex + 1);
  };

  return (
    <div style={{ padding: 8 }}>
      <div className="ProjectsTable">
        <div className="table-head">
          <div className="table-head table-row">
            <div className="table-cell">№</div>
            <div className="table-cell">Avatar</div>
            <div className="table-cell">Project Name</div>
            <div className="table-cell">Completed</div>
            <div className="table-cell icon_table">
              <TableChart />
            </div>
          </div>
        </div>
        <div className="table-body">
          {loader ? (
            <RingLoaderWithWrapper />
          ) : (
            <>
              {activeProjects.length ? (
                <Container
                  onDrop={onDropActive}
                  groupName="1"
                  dropPlaceholder={{ className: "drag-row-drop-preview" }}
                  lockAxis="y"
                  dragHandleSelector={isDraggable ? "" : ".drag-handle"}
                >
                  {activeProjects?.map((data, index) => (
                    <Draggable key={data.id}>
                      <div
                        className="table-row"
                        onClick={() =>
                          navigate(`/projects/${data.id}/dashboard`)
                        }
                      >
                        <div className="table-cell">{index + 1}</div>
                        <div className="table-cell">
                          <LogoDisplay url={data.logo} name={data.title} />
                        </div>
                        <div className="table-cell">{data.title}</div>
                        <div className="table-cell" id="table_description">
                          <span
                            style={{
                              background:
                                data?.percent === 0 || data?.percent <= 25
                                  ? "#FBC3C0"
                                  : data?.percent <= 50
                                  ? "#FFFCC2"
                                  : data?.percent <= 75
                                  ? "#D7EDFF"
                                  : data?.percent <= 100
                                  ? "#BBFBD0"
                                  : "#ffff",
                              color:
                                data?.percent === 0 || data?.percent <= 25
                                  ? "#F2271C"
                                  : data?.percent <= 50
                                  ? "#D29404"
                                  : data?.percent <= 75
                                  ? "#0452C8"
                                  : data?.percent <= 100
                                  ? "#119C2B"
                                  : "#000",
                            }}
                          >
                            {data.percent ? data.percent : 0}%
                          </span>
                        </div>
                        <div className="table-cell">
                          <ButtonsPopover
                            id={data.id}
                            onDeleteClick={deleteTableData}
                            onEditClick={navigateToEditForm}
                            permissionForDelete="PROJECTS/DELETE"
                          />
                        </div>
                      </div>
                    </Draggable>
                  )) ?? <EmptyDataComponent isVisible />}
                </Container>
              ) : null}
              {inactiveProjects.length ? (
                <Container
                  groupName="2"
                  onDrop={onDropInactive}
                  dropPlaceholder={{ className: "drag-row-drop-preview" }}
                  lockAxis="y"
                  dragHandleSelector={isDraggable ? "" : ".drag-handle"}
                >
                  {inactiveProjects?.map((data, index) => (
                    <Draggable key={data.id}>
                      <div
                        className="table-row"
                        style={{
                          borderTop:
                            activeProjects.length && index === 0
                              ? "3px solid #000"
                              : "",
                        }}
                        onClick={() =>
                          navigate(`/projects/${data.id}/dashboard`)
                        }
                      >
                        <div className="table-cell">
                          {index + 1 + activeProjects.length}
                        </div>
                        <div className="table-cell">
                          <LogoDisplay url={data.logo} name={data.title} />
                        </div>
                        <div className="table-cell">{data.title}</div>
                        <div className="table-cell" id="table_description">
                          <span
                            style={{
                              background:
                                data?.percent === 0 || data?.percent <= 25
                                  ? "#FBC3C0"
                                  : data?.percent <= 50
                                  ? "#FFFCC2"
                                  : data?.percent <= 75
                                  ? "#D7EDFF"
                                  : data?.percent <= 100
                                  ? "#BBFBD0"
                                  : "#ffff",
                              color:
                                data?.percent === 0 || data?.percent <= 25
                                  ? "#F2271C"
                                  : data?.percent <= 50
                                  ? "#D29404"
                                  : data?.percent <= 75
                                  ? "#0452C8"
                                  : data?.percent <= 100
                                  ? "#119C2B"
                                  : "#000",
                            }}
                          >
                            {data.percent ? data.percent : 0}%
                          </span>
                        </div>
                        <div className="table-cell">
                          <ButtonsPopover
                            permissionForDelete="PERMISSION/DELETE"
                            id={data.id}
                            onDeleteClick={deleteTableData}
                            onEditClick={navigateToEditForm}
                          />
                        </div>
                      </div>
                    </Draggable>
                  )) ?? null}
                </Container>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsTable;
