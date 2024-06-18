import React, { useContext, useState } from "react";
import TShowBox from "../TShowBox";
import TTitle from "../TTitle";
import "./style.scss";
import Datatable from "./Datatable";
import Precondition from "./Precondition";
import TestSteps from "./TestSteps";
import DataTableIcon from "../../../assets/icons/datatable.svg";
import BaseLineLink from "../../../assets/icons/ic_baseline-link.svg";
import PreconditionIcon from "../../../assets/icons/precondition.svg";
import TestStepsIcon from "../../../assets/icons/test-steps.svg";
import AddDescription from "./AddDescription";
import { DefineContext } from "../Define/Define";
import ClickAwayInput from "../../ClickAwayInput";
import Tags from "./Tags";
import BarChartIcon from "../../../assets/icons/bar_chart.svg";
import { GET_CASE_BY_ID } from "../../../apollo/requests/cases/cases";
import { useQuery } from "@apollo/client";
import TestResults from "./TestResults/TestResults";
import StatusSelect from "../../StatusSelect";

export default function CaseSteps({
  caseItem,
  setSelectedCase,
  tags,
  setTags,
}) {
  const {
    caseState,
    dispatchCase,
    handleUpdateCase,
    statusCaseList,
    setStatus,
    status,
  } = useContext(DefineContext);

  const [editing, setEditing] = useState(false);
  const [descEditing, setDescEditing] = useState(false);
  const counter = {
    show: true,
    count: caseItem.count_step || caseItem.step_count,
  };

  const onClickAway = (e) => {
    setEditing(false);
    setDescEditing(false);
    handleUpdateCase();
    refetch();
  };

  const handleChangeDescription = (e) => {
    dispatchCase({ type: "SET_DESCRIPTION", payload: e.target.value });
  };
  const handleEditingDesc = () => {
    setDescEditing(true);
  };
  const handleEditing = () => {
    setEditing(true);
  };

  const handleLinkChange = (e) => {
    dispatchCase({ type: "SET_LINK", payload: e.target.value });
  };

  const { data: { casesQuery = {} } = {}, refetch } = useQuery(GET_CASE_BY_ID, {
    variables: {
      id: caseItem.id,
    },
    onCompleted: (caseData) => {
      dispatchCase({
        type: "SET_DESCRIPTION",
        payload: caseData.casesQuery.description,
      });
    },
  });



  return (
    <div className="CaseStep">
  
      <div className="title">
        <TTitle
          title={caseItem.title}
          counter={counter}
          setSelectedCase={setSelectedCase}
          goBack
        />
        <StatusSelect
          caseStatusList={statusCaseList}
          onCaseStatusChange={handleUpdateCase}
          status={status}
          setStatus={setStatus}
        />
      </div>
      <div className="overflow-scroll">
        <AddDescription
          value={caseState.description}
          editing={descEditing}
          handleEditing={handleEditingDesc}
          rowTitle="Add description"
          title={casesQuery.description}
          onClickAway={onClickAway}
          onInputChange={handleChangeDescription}
        />
        <Tags
          tags={tags?.length ? tags : [{}]}
          dispatchCase={dispatchCase}
          setTags={setTags}
        />
        <TShowBox
          title="Datatable"
          icon={<img src={DataTableIcon} alt="img" />}
          content={<Datatable case_id={caseItem.id} />}
        />
        <TShowBox
          title="Precondition"
          icon={<img src={PreconditionIcon} alt="img" />}
          content={<Precondition case_id={caseItem.id} />}
        />
        <TShowBox
          title="Automation link"
          icon={<img src={BaseLineLink} alt="img" />}
          content={
            <ClickAwayInput
              value={casesQuery.link}
              editing={editing}
              handleEditing={handleEditing}
              onInputChange={handleLinkChange}
              onClickAway={onClickAway}
            />
          }
        />
        <TShowBox
          title="Test Steps"
          icon={<img src={TestStepsIcon} alt="img" />}
          content={<TestSteps case_id={caseItem.id} />}
          defaultOpen={true}
        />
        <TShowBox
          title="Test Results"
          icon={<img src={BarChartIcon} alt="img" />}
          content={<TestResults results={casesQuery.test_results} />}
          defaultOpen={true}
        />
      </div>
    </div>
  );
}
