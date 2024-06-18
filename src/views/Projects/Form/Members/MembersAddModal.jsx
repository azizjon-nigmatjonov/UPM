import { Card, IconButton, Modal, Typography } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useFormik } from "formik";
import CancelButton from "../../../../components/Buttons/CancelButton";
import CreateButton from "../../../../components/Buttons/CreateButton";
import SaveButton from "../../../../components/Buttons/SaveButton";
import { useParams } from "react-router-dom";
import "./style.scss";
import { useEffect } from "react";
import userService from "../../../../services/userService";
import positionsService from "../../../../services/positionsService";
import { useState } from "react";
import projectMembersService from "../../../../services/projectMembersService";
import FSelect from "../../../../components/FormElements/FSelect";

import FAutoComplete from "../../../../components/FormElements/FAutoComplete";
import UsersCreateModal from "./UserCreateModal";
import FRow from "../../../../components/FormElements/FRow";
import { store } from "../../../../redux/store";
import { showAlert } from "../../../../redux/thunks/alert.thunk";

const MembersAddModal = ({ closeModal, membersGroupId, addMember }) => {
  const { projectId } = useParams();

  const [positionsList, setPositionsList] = useState([]);
  const [btnLoader, setBtnLoader] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const closeCreateModal = () => setCreateModalVisible(false);
  const openCreateModal = () => setCreateModalVisible(true);

  const fetchPositonsList = () => {
    positionsService.getList().then((res) =>
      setPositionsList(
        res.positions?.map((el) => ({
          value: el.id,
          label: el.title,
        })) ?? []
      )
    );
  };

  const setSelectedUser = (data) => {
    formik.setFieldValue("user_id", data);
  };

  const create = (data) => {
    setBtnLoader(true);
    projectMembersService
      .create(data)
      .then((res) => {
        addMember();
        closeModal();
      })
      .catch((err) => {
        setBtnLoader(false);
        if (
          err?.data?.data ===
          "rpc error: code = Internal desc = member group is required to add new member"
        ) {
          store.dispatch(
            showAlert("Before adding a member, you must add a group member!")
          );
        }
      });
  };

  const onSubmit = (values) => {
    create({
      ...values,
      user_id: values.user_id?.id,
    });
  };

  const formik = useFormik({
    initialValues: {
      project_id: projectId,
      member_group_id: membersGroupId,
      position_id: "",
      user_id: null,
    },
    onSubmit,
  });

  useEffect(() => {
    fetchPositonsList();
  }, []);

  return (
    <div>
      {createModalVisible && (
        <UsersCreateModal
          setSelectedUser={setSelectedUser}
          closeModal={closeCreateModal}
        />
      )}

      <Modal open className="child-position-center" onClose={closeModal}>
        <Card className="MemberAddModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4">Add member</Typography>
            <IconButton color="primary" onClick={closeModal}>
              <HighlightOffIcon fontSize="large" />
            </IconButton>
          </div>

          <form onSubmit={formik.handleSubmit} className="form">
            <div className="form-elements">
              <FRow position="vertical" label="Position">
                <FSelect
                  options={positionsList}
                  // label="Position"
                  fullWidth
                  formik={formik}
                  name="position_id"
                />
              </FRow>

              <FRow position="vertical" label="User">
                <FAutoComplete
                  // label="User"
                  fullWidth
                  formik={formik}
                  name="user_id"
                  requestService={userService.getList}
                />
              </FRow>
            </div>

            <div className="btns-row">
              <CreateButton
                onClick={openCreateModal}
                title="Create new user"
                color="warning"
              />
              <CancelButton onClick={closeModal} />
              <SaveButton type="submit" loading={btnLoader} />
            </div>
          </form>
        </Card>
      </Modal>
    </div>
  );
};

export default MembersAddModal;
