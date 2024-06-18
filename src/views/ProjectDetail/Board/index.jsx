import { Container, Draggable } from "react-smooth-dnd";
import { useDispatch, useSelector } from "react-redux";
import Column from "./Column";
import "./style.scss";
import { applyDrag } from "../../../utils/applyDrag";
import statusService from "../../../services/statusService";
import RingLoader from "../../../components/Loaders/RingLoader";
import { useParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useState } from "react";
import sprintService from "../../../services/sprintService";
import sortByBoardOrderNumber from "../../../utils/sortByBoardOrderNumber";
import FiltersBlock from "../../../components/FiltersBlock";
import BugCreateModal from "../Backlog/Subtask/BugCreateModal";
import subtaskService from "../../../services/subtaskService";
import { sprintActions } from "../../../redux/slices/sprint.slice";
import { subtaskActions } from "../../../redux/slices/subtask.slice";
import { statusActions } from "../../../redux/slices/status.slice";
import Filters from "./Filters";

const BoardPage = () => {
  const dispatch = useDispatch();
  const { typeId, projectId } = useParams();
  const selectedSprint = useSelector((state) => state.sprint.selectedSprintId);
  const statusList = useSelector((state) => state.status.list);
  const statusLoader = useSelector((state) => state.project.statusLoader);
  const projectInfo = useSelector((state) => state.project.info);
  const userId = useSelector((state) => state.auth.userInfo.id);
  const taskTypeList = useSelector((state) => state.taskType.list);
  const selectedVersionId = useSelector(
    (state) => state.version.selectedVersionId
  );

  const [step, setStep] = useState(null);
  const [subtaskList, setSubtaskList] = useState(null);
  const [loader, setLoader] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [filters, setFilters] = useState({
    users: "",
    epics: "",
    stages: "",
    search: "",
  });

  const computedStatusList = useMemo(() => {
    return statusList.filter(
      (status) => status.project_task_type_id === typeId
    );
  }, [statusList, typeId]);

  const getStep = () => {
    setLoader(true);
    sprintService
      .getByPost({
        assignee_user_ids: filters.users ? [filters.users] : [],
        epic_ids: filters.epics ? [filters.epics] : [],
        stage_ids: filters.stages ? [filters.stages] : [],
        id: selectedSprint,
        search: filters.search ?? "",
      })
      .then((res) => {
        const lastStep = res.steps?.pop();
        setStep(lastStep);

        const data = {};

        computedStatusList.forEach((status) => {
          data[status.id] =
            lastStep?.sprint_subtask_items
              ?.filter((subtask) => subtask.status_id === status.id)
              ?.sort(sortByBoardOrderNumber) ?? [];
        });

        setSubtaskList(data);
      })
      .finally(() => setLoader(false));
  };

  const addCard = async (values, setShowCreateCard) => {
    try {
      setLoader(true);

      const data = {
        ...values,
        project_id: projectId,
        creator_id: userId,
        version_id: selectedVersionId,
      };

      const res = await subtaskService.create(data);

      dispatch(subtaskActions.addSubtask(res));

      const computedData = {
        ...res,
        project_sprint_step_id: step.project_sprint_step_id,
        sprint_id: selectedSprint,
        subtask_id: res.id,
        subtask_title: res.title,
      };

      const res2 = await sprintService.addSubtaskToSprint(computedData);

      const id =
        res2?.steps?.[res2?.steps?.length - 1]?.sprint_subtask_items?.[
          res2?.steps?.[0]?.sprint_subtask_items?.length - 1
        ]?.id;

      dispatch(
        sprintActions.addSubtaskToSprint({
          data: { ...computedData, id },
          stepId: step.id,
        })
      );

      setSubtaskList((prev) => ({
        ...prev,
        [computedData.status_id]: [
          ...(prev[computedData.status_id] ?? []),
          { ...data, ...computedData, id },
        ],
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setShowCreateCard(false);
      setLoader(false);
    }
  };

  const removeSubtask = (statusId, subtaskId) => {
    setSubtaskList((prev) => ({
      ...prev,
      [statusId]: prev[statusId]?.filter((subtask) => subtask.id !== subtaskId),
    }));
  };

  const changeSubtaskList = (statusId, list) => {
    setSubtaskList((prev) => ({
      ...prev,
      [statusId]: list,
    }));
  };

  const changeSubtaskStatus = (statusId, subtask) => {
    setSubtaskList((prev) => ({
      ...prev,
      [subtask.status_id]: prev[subtask.status_id]?.filter(
        (el) => el.id !== subtask.id
      ),
      [statusId]: prev[statusId]
        ? [...prev[statusId], { ...subtask, status_id: statusId }]
        : [{ ...subtask, status_id: statusId }],
    }));
  };

  const onSubtaskDataChange = (subtask) => {
    setSubtaskList((prev) => ({
      ...prev,
      [subtask.status_id]: prev[subtask.status_id]?.map((el) =>
        el.id === subtask.id ? { ...el, ...subtask } : el
      ),
    }));
  };

  const isBugPage = useMemo(() => {
    const bugTypeId = taskTypeList?.find((el) => el.title === "Bug")?.id;

    return bugTypeId === typeId;
  }, [taskTypeList, typeId]);

  useEffect(() => {
    if (!selectedSprint || !computedStatusList || statusLoader)
      return setLoader(false);
    getStep();
  }, [
    selectedSprint,
    statusLoader,
    typeId,
    computedStatusList?.length,
    filters,
  ]);

  const onDrop = (dropResult) => {
    const result = applyDrag(computedStatusList, dropResult);

    if (result) {
      dispatch(statusActions.changeOrders(result));
      updateStatusOrder(
        computedStatusList[dropResult.removedIndex].id,
        dropResult.addedIndex
      );
    }
  };

  const updateStatusOrder = (id, index) => {
    statusService.updateOrder(id, index + 1);
  };

  return (
    <div className="BoardPage">
      {modalVisible && (
        <BugCreateModal
          loading={modalLoading}
          createBug={addCard}
          closeModal={() => setModalVisible(false)}
        />
      )}

      <FiltersBlock>
        <Filters
          setLoader={setLoader}
          filters={filters}
          setFilters={setFilters}
          projectId={projectId}
          isBugPage={isBugPage}
          setModalVisible={setModalVisible}
        />
      </FiltersBlock>

      <div className="main-area">
        {statusLoader ? (
          <div className="loader-area child-position-center">
            <RingLoader />
          </div>
        ) : (
          <>
            <Container
              lockAxis="x"
              orientation="horizontal"
              onDrop={onDrop}
              dragHandleSelector=".column-header"
              dragClass="drag-card-ghost"
              dropClass="drag-card-ghost-drop"
              dropPlaceholder={{
                animationDuration: 150,
                showOnTop: true,
                className: "drag-cards-drop-preview",
              }}
            >
              {computedStatusList?.map((status) => (
                <Draggable key={status.id}>
                  <Column
                    getStep={getStep}
                    addCard={addCard}
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    changeSubtaskList={changeSubtaskList}
                    status={status}
                    step={step}
                    subtaskList={subtaskList}
                    loader={loader}
                    removeSubtask={removeSubtask}
                    changeSubtaskStatus={changeSubtaskStatus}
                    onSubtaskDataChange={onSubtaskDataChange}
                  />
                </Draggable>
              ))}
            </Container>
          </>
        )}
      </div>
    </div>
  );
};

export default BoardPage;
