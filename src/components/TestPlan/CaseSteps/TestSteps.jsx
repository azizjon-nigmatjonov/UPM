import React, { useContext, useState } from "react";
import AddRow from "./AddRow";
import { useQuery, useMutation } from "@apollo/client";
import { Container, Draggable } from "react-smooth-dnd";
import {
  CREATE_CASE_STEP,
  UPDATE_CASE_STEP,
  DELETE_CASE_STEP,
  GET_CASE_STEPS,
} from "../../../apollo/requests/case-steps/case-steps";
import { UPDATE_CASE_STEP_ORDER } from "../../../apollo/requests/cases/cases";
import { applyDrag } from "../../../utils/applyDrag";
import { DefineContext } from "../Define/Define";
import StepRowForTemplate from "./StepRowForTemplate/StepRowForTemplate";
import { CREATE_CASE_STEP_TEMPLATE_REQUEST } from "../../../apollo/requests/case-step-template/case-step-template";
import AddRowWithPopover from "./AddRowWithPopover";

export default function TestSteps({ case_id }) {
  const [caseSteps, setCaseSteps] = useState([]);
  const [caseIsChecked, setCaseIsChecked] = useState([]);

  const [createCaseStep] = useMutation(CREATE_CASE_STEP);
  const [updateCaseStep] = useMutation(UPDATE_CASE_STEP);
  const [deleteCaseStep] = useMutation(DELETE_CASE_STEP);
  const [updateCaseStepOrder] = useMutation(UPDATE_CASE_STEP_ORDER);
  const [createCaseStepTemplate] = useMutation(
    CREATE_CASE_STEP_TEMPLATE_REQUEST
  );
  const { getFolders } = useContext(DefineContext);
  const {
    data: { caseStepsQuery = [] } = {},
    loading,
    refetch,
  } = useQuery(GET_CASE_STEPS, {
    variables: {
      input: {
        case_id: case_id,
        offset: 0,
        limit: 100,
      },
    },
    onCompleted: setCaseSteps,
  });

  const onUpdate = (id, title, action_id) => {
    updateCaseStep({
      variables: {
        input: {
          id: id,
          title: title,
          action_id: action_id,
        },
      },
    })
      .then(() => refetch())
      .finally(() => getFolders());
  };
  const onCreate = (title) => {
    title &&
      createCaseStep({
        variables: {
          input: {
            case_id: case_id,
            title: title,
            action_id: "d5bdf861-553d-4477-9577-92b80b75a9e5",
          },
        },
      })
        .then(() => refetch())
        .finally(() => getFolders());
  };

  const onDelete = (id) => {
    deleteCaseStep({
      variables: {
        ids: caseIsChecked,
      },
    })
      .then(() => refetch())
      .finally(() => getFolders());
  };
  const handleOnCreateTemplate = (title) => {
    createCaseStepTemplate({
      variables: {
        input: {
          name: title,
          case_step_ids: caseIsChecked,
        },
      },
    });
  };

  const onDrop = (dropResult) => {
    const { removedIndex, addedIndex } = dropResult;

    const updatedOrder = applyDrag(caseStepsQuery, dropResult);
    setCaseSteps({ caseStepsQuery: updatedOrder });

    updateCaseStepOrder({
      variables: {
        id: caseStepsQuery[removedIndex].id,
        order_number: addedIndex + 1,
      },
    }).then(() => refetch());
  };

  let testIndex = 0;
  let resultIndex = 0;

  return (
    <div>
      <Container
        onDrop={onDrop}
        lockAxis="y"
        dragHandleSelector=".drag-handler-btn"
        dropPlaceholder={{ className: "drag-row-drop-preview" }}
      >
        {!loading &&
          caseSteps.caseStepsQuery?.map((step, mapIndex) => {
            const isAction = step.action_title !== "Result";
            if (isAction) {
              testIndex++;
              resultIndex = 0;
            } else {
              resultIndex++;
            }
            return (
              <Draggable key={step.id}>
                <StepRowForTemplate
                  key={step.id}
                  index={mapIndex}
                  order={isAction ? testIndex : ""}
                  step={step}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  actionResult
                  isDraggable
                  step_title={step.title}
                  setCaseIsChecked={setCaseIsChecked}
                  caseIsChecked={caseIsChecked}
                  handleOnCreateTemplate={handleOnCreateTemplate}
                />
              </Draggable>
            );
          })}
      </Container>

      {/* <AddRow onCreate={onCreate} title="Add step" /> */}
      <AddRowWithPopover
        handleSubmit={(title) => onCreate(title)}
        title="Add step"
      />
    </div>
  );
}
