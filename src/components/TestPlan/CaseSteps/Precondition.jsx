import React, { useState } from "react";
import AddRow from "./AddRow";
import StepRow from "./StepRow";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_PRECONDITION,
  UPDATE_PRECONDITION,
  DELETE_PRECONDITION,
  GET_PRECONDITIONS,
  UPDATE_PRECONDITION_ORDER,
} from "../../../apollo/requests/precondition/precondition";
import { Container, Draggable } from "react-smooth-dnd";
import { applyDrag } from "../../../utils/applyDrag";

export default function Precondition({ case_id }) {
  const [preconditions, setPrecondtions] = useState([]);
  const [createPrecondition] = useMutation(CREATE_PRECONDITION);
  const [updatePrecondition] = useMutation(UPDATE_PRECONDITION);
  const [deletePrecodition] = useMutation(DELETE_PRECONDITION);
  const [updatePrecontionOrder] = useMutation(UPDATE_PRECONDITION_ORDER);

  const {
    data: { preconditionsQuery = {} } = {},
    loading,
    refetch,
  } = useQuery(GET_PRECONDITIONS, {
    variables: {
      input: {
        case_id: case_id,
        offset: 0,
        limit: 100,
      },
    },
    onCompleted: setPrecondtions,
  });

  const onUpdate = (id, title) => {
    updatePrecondition({
      variables: {
        input: {
          id: id,
          title: title,
        },
      },
    }).then(() => refetch());
  };

  const onCreate = (title) => {
    createPrecondition({
      variables: {
        input: {
          case_id: case_id,
          title: title,
        },
      },
    }).then(() => refetch());
  };

  const onDelete = (id) => {
    deletePrecodition({
      variables: {
        id: id,
      },
    }).then(() => refetch());
  };

  const onDrop = (dropResult) => {
    const { removedIndex, addedIndex } = dropResult;

    const updatedOrder = applyDrag(preconditionsQuery, dropResult);
    setPrecondtions({ preconditionsQuery: updatedOrder });

    updatePrecontionOrder({
      variables: {
        id: preconditionsQuery[removedIndex].id,
        order_number: addedIndex + 1,
      },
    }).then(() => refetch());
  };

  return (
    <div>
      <Container
        onDrop={onDrop}
        lockAxis="y"
        dragHandleSelector=".drag-handler-btn"
        dropPlaceholder={{ className: "drag-row-drop-preview" }}
      >
        {!loading &&
          preconditions?.preconditionsQuery?.map((step, idx) => (
            <Draggable key={step.id}>
              <StepRow
                order={idx + 1}
                isDraggable
                key={step.id}
                step={step}
                onUpdate={onUpdate}
                onDelete={onDelete}
                step_title={step.title}
              />
            </Draggable>
          ))}
      </Container>

      <AddRow onCreate={onCreate} title="Add prediction" />
    </div>
  );
}
