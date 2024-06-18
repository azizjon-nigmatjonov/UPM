import { Edit, Delete } from "@mui/icons-material";
import { useState } from "react";
import { useDispatch } from "react-redux";

import IconPicker from "../../../components/IconPicker";
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton";
import { deleteProjectStageAction, updateProjectStageAction } from "../../../redux/thunks/projectStage.thunk";
import TitleCreateForm from "../../../components/CreateForms/TitleCreateForm";

const StageRow = ({ stage }) => {
  const dispatch = useDispatch();

  const [editFormVisible, setEditFormVisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);

  const deleteHandler = () => {
    setDeleteLoader(true);

    dispatch(deleteProjectStageAction(stage.id)).then(() => setLoader(false));
  };

  const updateHandler = (data) => {
    setLoader(true);

    dispatch(
      updateProjectStageAction({
        ...stage,
        ...data,
      })
    )
      .unwrap()
      .then(() => setEditFormVisible(false))
      .finally(() => setLoader(false));
  };

  const titleUpdateHandler = ({ title }) => {
    updateHandler({ title });
  };

  const iconUpdateHandler = (icon) => {
    updateHandler({ icon });
  };

  if (editFormVisible)
    return (
      <TitleCreateForm
        formVisible={editFormVisible}
        setFormVisible={setEditFormVisible}
        onSubmit={titleUpdateHandler}
        initialValues={stage}
        loader={loader}
      />
    );

  return (
    <div className="GroupRow row">
      <IconPicker
        loading={loader}
        value={stage.icon}
        onChange={iconUpdateHandler}
      />

      <div className="title-block">{stage.title}</div>

      <RectangleIconButton
        color="primary"
        onClick={() => setEditFormVisible(true)}
      >
        <Edit color="primary" />
      </RectangleIconButton>

      <RectangleIconButton
        color="error"
        loader={deleteLoader}
        onClick={deleteHandler}
      >
        <Delete color="error" />
      </RectangleIconButton>
    </div>
  );
};

export default StageRow;
