import * as Yup from "yup";
import React, { createContext, useEffect, useReducer, useState } from "react";
import "./style.scss";
import TTitle from "../TTitle";
import TFolders from "../TFolders";
import TFolderInside from "../TFolderInside";
import folderService from "../../../services/folderService";
import { useParams } from "react-router-dom";
import { LinearProgress } from "@mui/material";
import TModal from "../TModal";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_FOLDER,
  DELETE_FOLDER,
  UPDATE_FOLDER,
} from "../../../apollo/requests/folders/folders";
import { useFormik } from "formik";
import TestCases from "../TestCases";
import CaseSteps from "../CaseSteps/CaseSteps";
import {
  GET_CASES,
  UPDATE_CASE,
  UPDATE_CASE_ORDER,
} from "../../../apollo/requests/cases/cases";
import { useSelector } from "react-redux";

export const DefineContext = createContext(null);
const statusCaseList = [
  { title: "draft", id: 1, color: "#6F7B8F" },
  { title: "review", id: 2, color: "#D29404" },
  { title: "outdated", id: 3, color: "#F2271C" },
  { title: "active", id: 4, color: "#1AC19D" },
];
const initialState = {
  id: "",
  title: "",
  description: "",
  link: "",
  tags: [],
};

const caseReducer = (state, action) => {
  switch (action.type) {
    case "SET_ALL":
      return { ...action.payload };
    case "SET_DESCRIPTION":
      return { ...state, description: action.payload };
    case "SET_LINK":
      return { ...state, link: action.payload };
    case "SET_STATUS":
      return { ...state, status: action.payload };
    case "SET_TAGS":
      return { ...state, tags: [...state.tags, action.payload] };
    default:
      return state;
  }
};

export default function Define() {
  const [selected, setSelected] = useState(null); // selected folder
  const [selectedCase, setSelectedCase] = useState(null); // selected case
  const [status, setStatus] = useState(4); //selected case id
  const [loading, setLoading] = useState(null);
  const [open, setOpen] = useState(false);
  const [folders, setFolders] = useState([]);
  const { projectId } = useParams();
  const [caseState, dispatchCase] = useReducer(caseReducer, initialState);
  const [createFolder] = useMutation(CREATE_FOLDER);
  const [updateFolder] = useMutation(UPDATE_FOLDER);
  const [deleteFolder] = useMutation(DELETE_FOLDER);
  const [updateCase] = useMutation(UPDATE_CASE);
  const [updateCaseOrder] = useMutation(UPDATE_CASE_ORDER);
  const [casesQueryData, setCasesQueryData] = useState([]);
  const checkedFolders = useSelector((state) => state.testPlan.checkedFolders);
  // const selectedFolder = useSelector((state) => state.testPlan.selectedFolder)
  // console.log("selectedFolder", selectedFolder)
  const [tags, setTags] = useState([]);
  const getFolders = () => {
    setLoading(true);
    folderService
      .getById({ project_id: projectId, tags: [] })
      .then((res) => setFolders(JSON.parse(res.folders)))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  const onDelete = (e, id) => {
    e.stopPropagation();
    deleteFolder({
      variables: {
        id,
      },
    }).then((res) => getFolders());
  };

  const handleCreate = (folder) => {
    //localstorage set
    setSelected(folder);
    formik.setValues({
      id: folder.update ? folder.id : "",
      title: folder.update ? folder.title : "",
      project_id: projectId,
      parent_folder_id: folder.update ? folder.parent_folder_id : folder?.id,
      order_number: folder.update
        ? folder.order_number
        : folder?.child_folders?.length + 1,
    });
    setOpen(true);
  };

  const parentCreate = () => {
    formik.setValues({
      title: "",
      project_id: projectId,
      parent_folder_id: "parent",
      order_number: 1,
    });
    setOpen(true);
  };

  const onSubmit = (values) => {
    if (selected?.update) {
      delete values.project_id;
      delete values.parent_folder_id;
      delete values.order_number;
    } else delete values.id;
    let selectedAction = selected?.update ? updateFolder : createFolder;
    selectedAction({
      variables: {
        input: values,
      },
    })
      .then(() => getFolders())
      .then(() => setOpen(false))
      .catch((err) => console.log(err))
      .finally(() => formik.handleReset());
  };

  const formik = useFormik({
    initialValues: { title: "" },
    onSubmit: onSubmit,
    validationSchema: Yup.object({
      title: Yup.string().required("Required"),
    }),
  });

  const handleUpdateCase = (filteredTags) => {
    updateCase({
      variables: {
        input: {
          id: caseState.id,
          title: caseState.title,
          description: caseState.description,
          link: caseState.link || "",
          tags: filteredTags
            ? filteredTags.filter((elm) => elm.label).map((el) => el.label)
            : tags.filter((elm) => elm.label).map((el) => el.label),
          status:
            statusCaseList.find((v) => v.id == status)?.title.toUpperCase() ||
            "ACTIVE",
        },
      },
    }).then(() => {
      getFolders();
    });
  };

  const { refetch } = useQuery(GET_CASES, {
    variables: {
      input: {
        folder_id: selected?.id,
        offset: 0,
        limit: 100,
      },
    },
    onCompleted: ({ casesQuery }) => setCasesQueryData(casesQuery),
  });
  const handleOnDragEnd = (result) => {
    const items = Array.from(casesQueryData);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setCasesQueryData(items);

    updateCaseOrder({
      variables: {
        order_number: result.destination.index + 1,
        id: result.draggableId,
      },
    }).then(() => refetch());
  };
  const recursiveFn = (folder) => {
    folder.child_folders?.forEach((element) => {
      if (checkedFolders?.includes(element.id)) {
        element.open = true;
      } else {
        element.open = false;
      }
      recursiveFn(element);
    });
  };

  useEffect(() => {
    folders.forEach((item) => {
      if (checkedFolders?.includes(item.id)) {
        item.open = true;
      }
      recursiveFn(item);
    });
  }, [folders, checkedFolders]);

  useEffect(() => {
    setSelectedCase(null);
  }, [selected]);

  //////////// for Case Status Change ////////////////////
  useEffect(() => {
    if (!!selectedCase?.status) {
      const statusId = statusCaseList.find(
        (v) => v.title.toUpperCase() === selectedCase?.status
      ).id;
      setStatus(statusId);
    }
    if (!!selectedCase?.tags) {
      setTags(selectedCase.tags.map((elm) => ({ label: elm })));
    }
  }, [selectedCase]);

  useEffect(() => {
    status && handleUpdateCase();
  }, [status]);
  //////////////////////////////////////////////////////

  useEffect(() => {
    getFolders();
  }, []);
  console.log(selectedCase);
  return (
    <DefineContext.Provider
      value={{
        caseState,
        dispatchCase,
        handleUpdateCase,
        setTags,
        refetch,
        tags,
        getFolders,
        statusCaseList,
        setStatus,
        status,
      }}
    >
      <div className="Define">
        <div className="left">
          <div className="folder-title">
            <TTitle
              title="Folders"
              parentCreate={parentCreate}
              canCreate={true}
              // !loading && folders?.length ? false : true
            />
          </div>
          <div className="folder-wrapper">
            {loading && <LinearProgress />}
            {folders?.map((folder) => {
              return (
                <TFolders
                  key={folder.id}
                  folder={folder}
                  title={folder.title}
                  depth={0}
                  selected={selected}
                  setSelected={setSelected}
                  setOpen={setOpen}
                  deleteFolder={onDelete}
                  handleCreate={handleCreate}
                  setSelectedCase={setSelectedCase}
                  dispatchCase={dispatchCase}
                  setTags={setTags}
                />
              );
            })}
          </div>
        </div>

        <div className="right">
          {selected && selected.child_folders?.length > 0 && !selectedCase && (
            <TFolderInside
              folder={selected}
              getFolders={getFolders}
              handleCreate={handleCreate}
              setSelected={setSelected}
            />
          )}

          {selected && !selected.child_folders?.length > 0 && !selectedCase && (
            <TestCases
              folder={selected}
              setSelectedCase={setSelectedCase}
              dispatchCase={dispatchCase}
              refetch={refetch}
              casesQuery={casesQueryData}
              getFolders={getFolders}
              handleOnDragEnd={handleOnDragEnd}
            />
          )}

          {selectedCase && (
            <CaseSteps
              setSelectedCase={setSelectedCase}
              caseItem={selectedCase}
              refetch={refetch}
              tags={tags}
              setTags={setTags}
            />
          )}
        </div>

        <TModal
          formik={formik}
          open={open}
          setOpen={setOpen}
          onSubmit={formik.handleSubmit}
          onChange={formik.handleChange}
          handleReset={formik.handleReset}
          values={formik.values}
          title={`${selected?.update ? "Edit" : "Create new"} folder`}
          okText={`${selected && selected.update ? "Update" : "Create"}`}
        />
      </div>
    </DefineContext.Provider>
  );
}
