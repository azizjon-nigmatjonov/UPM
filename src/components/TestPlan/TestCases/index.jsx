import * as Yup from "yup";
import React, { useState } from "react";
import TCaseBaseRow from "../TBaseRow/TCaseBaseRow";
import TTitle from "../TTitle";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  CREATE_CASE,
  DELETE_CASE,
  UPDATE_CASE,
} from "../../../apollo/requests/cases/cases";
import { useMutation } from "@apollo/client";
import TModal from "../TModal";
import { useFormik } from "formik";
import CaseRow from "./CaseRow";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

export default function TestCases({
  folder,
  setSelectedCase,
  casesQuery,
  refetch,
  getFolders,
  handleOnDragEnd = () => {},
}) {
  const [selectedCases, setSelectedCases] = useState([]);
  const [open, setOpen] = useState(false);
  const [createCase] = useMutation(CREATE_CASE);
  const [updateCase] = useMutation(UPDATE_CASE);
  const [deleteCase] = useMutation(DELETE_CASE);

  const onSubmit = (values) => {
    let selectedAction = values.id ? updateCase : createCase;
    selectedAction({
      variables: {
        input: values,
      },
    })
      .then(() => {
        formik.handleReset();
        refetch();
        setOpen(false);
      })
      .finally(() => getFolders());
  };

  const handleCreate = (id) => {
    formik.setFieldValue("folder_id", id);
    setOpen(true);
  };

  const handleUpdate = (id, title, item) => {
    formik.setValues({
      id: id,
      title: title,
      link: item.link,
      description: item.description,
      tags: item.tags,
      status: "",
    });
    setOpen(true);
  };

  const onDelete = (id) => {
    deleteCase({
      variables: { id },
    }).then((res) => {
      refetch();
    });
  };

  const formik = useFormik({
    initialValues: { title: "" },
    onSubmit: onSubmit,
    validationSchema: Yup.object({
      title: Yup.string().required("Required"),
    }),
  });
  return (
    <div>
      <TTitle title={folder?.title} />
      <div className="main-area">
        <TCaseBaseRow
          folder={folder}
          title="Cases"
          setSelectedCases={setSelectedCases}
          selectedCases={selectedCases}
          cases={casesQuery}
          refetch={refetch}
          getFolders={getFolders}
        />
        <div className="scrollable">
          {casesQuery.length > 0 && (
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="characters">
                {(provider) => (
                  <div {...provider.droppableProps} ref={provider.innerRef}>
                    {casesQuery?.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(providerChild) => (
                          <div
                            ref={providerChild.innerRef}
                            {...providerChild.draggableProps}
                          >
                            <CaseRow
                              item={item}
                              onDelete={onDelete}
                              handleUpdate={handleUpdate}
                              setSelectedCase={setSelectedCase}
                              setSelectedCases={setSelectedCases}
                              selectedCases={selectedCases}
                              providerChild={providerChild}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provider.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}

          <div className="add-btn">
            <Button
              startIcon={<AddIcon />}
              onClick={() => handleCreate(folder.id)}
            >
              Create
            </Button>
          </div>
        </div>
      </div>

      <TModal
        open={open}
        setOpen={setOpen}
        onSubmit={formik.handleSubmit}
        onChange={formik.handleChange}
        handleReset={formik.handleReset}
        values={formik.values}
        title={`${formik.values.id ? "Edit" : "Create new"} Scenario`}
        okText={`${formik.values.id ? "Update" : "Create"}`}
        label="Case Name"
      />
    </div>
  );
}
