import { useEffect, useState } from "react";
import CreateRowButton from "../../../../components/CreateRowButton";
import sprintService from "../../../../services/sprintService";
import RowLinearLoader from "../../../../components/RowLinearLoader";
import { Collapse } from "@mui/material";
import SprintCreateRow from "./SprintCreateRow";
import { useParams } from "react-router-dom";
import SprintRow from "./SprintRow";
import { Container, Draggable } from "react-smooth-dnd";
import { applyDrag } from "../../../../utils/applyDrag";
import {
  sortByOrderNumber,
  sortByOrderNumberReverse,
} from "../../../../utils/sortByOrderNumber";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { sprintActions } from "../../../../redux/slices/sprint.slice";

const SprintsBlock = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();

  const sprintStepsList = useSelector((state) => state.project.sprintStepsList);
  const sprintsList = useSelector((state) => state.sprint.list);
  const loader = useSelector((state) => state.sprint.loader);
  const userId = useSelector((state) => state.auth.userInfo.id);

  const [createFormVisible, setCreateFormVisible] = useState(false);
  const [createLoader, setCreateLoader] = useState(false);

  const createNewSprint = ({ date }) => {
    const data = {
      creator_id: userId,
      from_date: date[0],
      to_date: date[1],
      is_locked: false,
      project_sprint_step_id: sprintStepsList[0]?.id,
      project_id: projectId,
    };
    setCreateLoader(true);
    sprintService
      .create(data)
      .then((res) => {
        setCreateFormVisible(false);

        dispatch(sprintActions.add(res));
      })
      .catch(() => setCreateLoader(false));
  };

  const onDrop = (dropResult) => {
    // const result = applyDrag(sprintsList, dropResult)
    // if (result) {
    //   setSprintsList(result)
    //   updateVersionOrder(dropResult)
    // }
  };

  const updateVersionOrder = ({ removedIndex, addedIndex }) => {
    sprintService.updateOrder(sprintsList[removedIndex].id, addedIndex + 1);
  };

  return (
    <div className="card">
      <div className="card-header silver-bottom-border">
        <div className="card-title">SPRINTS</div>
        <div className="card-extra">
          <CreateRowButton
            formVisible={createFormVisible}
            setFunction={setCreateFormVisible}
          />
        </div>
        <RowLinearLoader visible={loader} />
      </div>

      <Collapse in={createFormVisible} className="silver-bottom-border">
        <SprintCreateRow
          onSubmit={createNewSprint}
          loader={createLoader}
          setLoader={setCreateLoader}
          visible={createFormVisible}
          placeholder="Epic title"
        />
      </Collapse>

      {/* <Container onDrop={onDrop} lockAxis="y" dropPlaceholder={{ className: "drag-row-drop-preview" }}> */}
      {sprintsList?.map((sprint, index) => (
        // <Draggable key={sprint.id}>
        <SprintRow key={sprint.id} sprint={sprint} index={index} />
        // </Draggable>
      ))}
      {/* </Container> */}
    </div>
  );
};

export default SprintsBlock;
