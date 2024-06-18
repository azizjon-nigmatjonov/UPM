import { Collapse } from "@mui/material";
import EpicsRow from "./EpicsRow";
import CreateRow from "../CreateRow";
import { useEffect, useMemo, useState } from "react";
import epicsService from "../../../../services/epicsService";
import RowLinearLoader from "../../../../components/RowLinearLoader";
import CreateRowButton from "../../../../components/CreateRowButton";
import { applyDrag } from "../../../../utils/applyDrag";
import { sortByOrderNumber } from "../../../../utils/sortByOrderNumber";
import { Container, Draggable } from "react-smooth-dnd";
import { useSelector } from "react-redux";
import "./style.scss";

const EpicsBlock = ({ disableEdit, width, addEpic = () => {} }) => {
  const projectInfo = useSelector((state) => state.project.info);
  const userId = useSelector((state) => state.auth.userInfo.id);

  const selectedVersion = useSelector(
    (state) => state.version.selectedVersionId
  );

  const [createFormVisible, setCreateFormVisible] = useState();
  const [createLoader, setCreateLoader] = useState(false);
  const [epicsList, setEpicsList] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (!selectedVersion) return null;
    getEpicsList();
  }, [selectedVersion]);

  const getEpicsList = () => {
    setLoader(true);
    epicsService
      .getList(selectedVersion)
      .then((res) => setEpicsList(res.epic_items?.sort(sortByOrderNumber)))
      .finally(() => setLoader(false));
  };
  const today = new Date()
  const createNewEpicAction = ({ title }) => {
    const data = {
      creator_id: userId,
      order_number: epicsList?.length || 0,
      title,
      version_id: selectedVersion,
      status_id: projectInfo.default_status,
      locked: -1
    };

    setCreateLoader(true);
    epicsService
      .create(data)
      .then((res) => {
        setCreateFormVisible(false);
        setEpicsList(res.epic_items);
        addEpic(res.epic_items);
      })
      .catch(() => setCreateLoader(false));
  };

  const updateEpicOrderAction = ({ removedIndex, addedIndex }) => {
    epicsService.updateOrder(
      epicsList[removedIndex].id,
      addedIndex + 1,
      selectedVersion
    );
  };

  const onDrop = (dropResult) => {
    const result = applyDrag(epicsList, dropResult);

    if (result) {
      setEpicsList(result);
      updateEpicOrderAction(dropResult);
    }
  };

  return (
    <div className={`EpicsBlock card silver-right-border`}>
      {!disableEdit && (
        <div className="card-header silver-bottom-border">
          <div className="card-title">EPICS</div>
          <div className="card-extra">
            <CreateRowButton
              formVisible={createFormVisible}
              setFunction={setCreateFormVisible}
            />
          </div>
          <RowLinearLoader visible={loader} />
        </div>
      )}

      <Collapse in={createFormVisible} className="silver-bottom-border">
        <CreateRow
          onSubmit={createNewEpicAction}
          loader={createLoader}
          setLoader={setCreateLoader}
          visible={createFormVisible}
          setVisible={setCreateFormVisible}
          placeholder="Epic title"
        />
      </Collapse>

      <Container
        onDrop={onDrop}
        lockAxis="y"
        dropPlaceholder={{ className: "drag-row-drop-preview" }}
      >
        {epicsList?.map((epic, index) => (
          <Draggable key={epic.id}>
            <EpicsRow
              key={epic.id}
              epic={epic}
              index={index}
              setEpicsList={setEpicsList}
              selectedVersion={selectedVersion}
              level={1}
              disableEdit={disableEdit}
            />
          </Draggable>
        ))}
      </Container>
    </div>
  );
};

export default EpicsBlock;
