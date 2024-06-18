import React, { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "./workload.scss";
import { Clear, ArrowBack } from "@mui/icons-material";
import StaticTable from "../../components/Table";
import WorkloadAdd from "./WorkloadAdd";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  minHeight: "200px",
  maxHeight: "600px",
  overflowY: "scroll",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "4px",
  // padding: "0",
};

export default function AvialableModal({
  users,
  open,
  setOpen,
  setAvailableUsers = () => {},
  fromDate,
}) {
  const [developerObj, setDeveloperObj] = useState({});

  const initialCol = {
    title: "№",
    key: "index",
    width: 10,
  };
  const [headColEnd, setHeadColEnd] = useState({});

  const unassignedUsers = useMemo(() => {
    return (
      users?.unassigned?.map((item, ind) => ({
        index: ind + 1,
        ...item,
      })) ?? []
    );
  }, [users]);

  const halfAssigned = useMemo(() => {
    return (
      users?.half_assigned?.map((item, ind) => ({
        index: ind + 1,
        ...item,
      })) ?? []
    );
  }, [users]);

  const fullyAssigned = useMemo(() => {
    return (
      users?.fully_assigned?.map((item, ind) => ({
        index: ind + 1,
        ...item,
      })) ?? []
    );
  }, [users]);

  useEffect(() => {
    const obj = {
      title: "Given",
      key: "given",
      width: 100,
      render: (val) => (
        <div className={`userNumber ${statusNumber(val)}`}>{val || 0}</div>
      ),
    };
    setHeadColEnd(obj);
  }, [unassignedUsers, halfAssigned, fullyAssigned]);

  const [headColumns, setHeadlColumns] = useState([]);
  useEffect(() => {
    let obj = {
      title: "Unassigned",
      key: ["user_name", "user_id", "given"],
      render: (val) => (
        <div className={"addName"}>
          <span>{val[0]}</span>
          {/* {
              val[2] < 1 ? (<div className="icon" onClick={() =>  setDeveloperObj({user_id: val[1], given: val[2]})}>
              <Add />
            </div>) : ''
            } */}
        </div>
      ),
    };
    setHeadlColumns([initialCol, obj, headColEnd]);
  }, [unassignedUsers, headColEnd]);

  const [halfAssignedHeadColumns, setHalfAssignedHeadColumns] = useState([]);
  useEffect(() => {
    const obj = {
      title: "Half-assigned",
      key: ["user_name", "user_id", "given"],
      render: (val) => (
        <div className={"addName"}>
          <span>{val[0]}</span>
          {/* {
            val[2] < 1 ? (<div className="icon" onClick={() =>  setDeveloperObj({user_id: val[1], given: val[2]})}>
            <Add />
          </div>) : ''
          } */}
        </div>
      ),
    };
    setHalfAssignedHeadColumns([initialCol, obj, headColEnd]);
  }, [halfAssigned, headColEnd]);

  const [fullyAssignedHeadColumns, setFullyAssignedHeadColumns] = useState([]);
  useEffect(() => {
    const obj = {
      title: "Fully assigned",
      key: ["user_name", "user_id", "given"],
      render: (val) => (
        <div className={"addName"}>
          <span>{val[0]}</span>
          {/* {
            val[2] < 1 ? (<div className="icon" onClick={() =>  setDeveloperObj({user_id: val[1], given: val[2]})}>
            <Add />
          </div>) : ''
          } */}
        </div>
      ),
    };
    setFullyAssignedHeadColumns([initialCol, obj, headColEnd]);
  }, [fullyAssigned, headColEnd]);

  function statusNumber(num) {
    let res = "half";
    if (num === 0) {
      res = "null";
    } else if (num === 1) {
      res = "full";
    }
    return res;
  }

  const handleClose = () => {
    setOpen(false);
    setAvailableUsers({});
    setDeveloperObj({});
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div>
          <div className="users-header">
            <div className="left">
              {developerObj?.user_id && (
                <ArrowBack onClick={() => setDeveloperObj({})} />
              )}
              <h3>{users?.role?.name}</h3>
            </div>
            <Clear style={{ color: "#B0BABF" }} onClick={() => handleClose()} />
          </div>
          <div style={{ padding: "10px 18px" }}>
            <span style={{ marginRight: "10px", fontWeight: "600" }}>
              Fully assigned: {users?.fully_assigned?.length ?? 0}
            </span>
            <span style={{ marginRight: "10px", fontWeight: "600" }}>
              Half assigned: {users?.half_assigned?.length ?? 0}
            </span>
            <span style={{ marginRight: "10px", fontWeight: "600" }}>
              Unassigned: {users?.unassigned?.length ?? 0}
            </span>
          </div>
          {!developerObj?.user_id ? (
            <div>
              <div className="users-table">
                <StaticTable
                  headColumns={headColumns ?? []}
                  bodyColumns={unassignedUsers}
                  nullData={!unassignedUsers?.length}
                  bodyHover={true}
                  heightFit={true}
                />
              </div>
              <div className="users-table mt-5">
                <StaticTable
                  headColumns={halfAssignedHeadColumns ?? []}
                  bodyColumns={halfAssigned}
                  nullData={!halfAssigned?.length}
                  bodyHover={true}
                  heightFit={true}
                />
              </div>
              <div className="users-table mt-5">
                <StaticTable
                  headColumns={fullyAssignedHeadColumns ?? []}
                  bodyColumns={fullyAssigned}
                  nullData={!fullyAssigned?.length}
                  bodyHover={true}
                  heightFit={true}
                />
              </div>
            </div>
          ) : (
            <WorkloadAdd
              users={users}
              fromDate={fromDate}
              initialCol={initialCol}
              statusNumber={statusNumber}
              developerObj={developerObj}
            />
          )}
        </div>
      </Box>
    </Modal>
  );
}
