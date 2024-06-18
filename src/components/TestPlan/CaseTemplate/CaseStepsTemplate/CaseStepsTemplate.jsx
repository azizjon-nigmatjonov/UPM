import { useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Container, Draggable } from "react-smooth-dnd";
import {
  GET_CASE_STEP_TEMPLATE_BY_ID,
  UPDATE_CASE_STEP_TEMPLATE,
} from "../../../../apollo/requests/case-step-template/case-step-template";
import {
  CREATE_CASE_STEP,
  DELETE_CASE_STEP,
  UPDATE_CASE_STEP,
} from "../../../../apollo/requests/case-steps/case-steps";
import { applyDrag } from "../../../../utils/applyDrag";
import AddRow from "../../CaseSteps/AddRow";
import CaseStepTemplateRow from "../CaseStepTemplateRow/CaseStepTemplateRow";


export default function CaseStepsTemplate({ id }) {
  const [caseSteps, setCaseSteps] = useState({});
  const [caseIsChecked, setCaseIsChecked] = useState([]);
  const [createCaseStep] = useMutation(CREATE_CASE_STEP);
  const [updateCaseStepTemplate] = useMutation(UPDATE_CASE_STEP_TEMPLATE);
  const [updateCaseStep] = useMutation(UPDATE_CASE_STEP);
  const [deleteCaseStep] = useMutation(DELETE_CASE_STEP);

  const { loading, refetch } = useQuery(GET_CASE_STEP_TEMPLATE_BY_ID, {
    variables: {
      id: id,
      offset: 0,
      limit: 100,
    },
    onCompleted: ({ getCaseStepTemplateByID }) => {
      setCaseSteps(getCaseStepTemplateByID);
    },
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
  const getFolders = async (id) => {
    const case_step_ids = caseSteps?.case_steps?.map((item) => item.id);
    await updateCaseStepTemplate({
      variables: {
        input: {
          id: caseSteps.id,
          name: caseSteps.name,
          case_step_ids: [...case_step_ids, id],
        },
      },
    });
  };

  const onCreate = (title) => {
    title &&
      createCaseStep({
        variables: {
          input: {
            case_id: "ca65a85f-1cfb-40a2-b835-7dfd710f23c1",
            title: title,
            action_id: "d5bdf861-553d-4477-9577-92b80b75a9e5",
          },
        },
      }).then(({ data }) => getFolders(data?.createCaseStep?.id));
  };

  const onDelete = (id) => {
    deleteCaseStep({
      variables: {
        ids: [id],
      },
    }).then(() => refetch());
  };
  const onDrop = async (dropResult) => {
    const updatedOrder = applyDrag(caseSteps?.case_steps, dropResult);
    setCaseSteps((prev) => ({ ...prev, case_steps: updatedOrder }));
    const case_step_ids = updatedOrder.map((item) => item.id);
    await updateCaseStepTemplate({
      variables: {
        input: {
          id: id,
          case_step_ids: case_step_ids,
        },
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
          caseSteps?.case_steps?.map((step, mapIndex) => {
            const isAction = step?.action_title !== "Result";
            if (isAction) {
              testIndex++;
              resultIndex = 0;
            } else {
              resultIndex++;
            }
            return (
              <Draggable key={step?.id}>
                <CaseStepTemplateRow
                  key={step.id}
                  index={mapIndex}
                  order={isAction ? testIndex : `${testIndex}.${resultIndex}`}
                  step={step}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  actionResult
                  isDraggable
                  step_title={step.title}
                  setCaseIsChecked={setCaseIsChecked}
                  caseIsChecked={caseIsChecked}
                />
              </Draggable>
            );
          })}
      </Container>

      <AddRow onCreate={onCreate} title="Add step" />
    </div>
  );
}
