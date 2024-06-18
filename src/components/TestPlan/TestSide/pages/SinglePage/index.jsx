import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import TTitle from "../../../TTitle";
import FiltersBlock from "../../../../FiltersBlock";
import TPie from "../../../TPie";
import TButton from "../../../TButton/";
import { PlayArrow } from "@mui/icons-material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import TFolders from "../../../TFolders";
import cls from "./style.module.scss";
import projectTestService from "../../../../../services/projectTestService";
import { useParams } from "react-router-dom";
import { LinearProgress } from "@mui/material";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";
import TModal from "../../../TModal";
import { useFormik } from "formik";
import dataTableService from "../../../../../services/dataTableService";
import { useQuery } from "@apollo/client";
import { GET_PRECONDITIONS } from "../../../../../apollo/requests/precondition/precondition";

export default function TestSinglePage() {
  const navigate = useNavigate();
  const { testId, projectId } = useParams();

  const [pieData, setPieData] = useState({});
  const [loading, setLoading] = useState(null);
  const [selected, setSelected] = useState(null); // selected folder
  const [open, setOpen] = useState(false);
  const [restartOpen, setRestartOpen] = useState(false);

  function getTestData() {
    if (testId && projectId) {
      setLoading(true);
      const params = {
        id: testId,
        "project-id": projectId,
      };
      projectTestService
        .getById(testId, params)
        .then((res) => {
          setPieData(res);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }

  const onSubmit = (values) => {
    const data = {
      name: values.title,
      test_id: pieData.id,
    };
    projectTestService.testRestart(data).then((res) => {
      setOpen(false);
      setRestartOpen(false);
      navigate(`/projects/${projectId}/test-plan/${res.id}`);
    });
  };

  const formik = useFormik({
    initialValues: {
      title: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Required"),
    }),
    onSubmit: onSubmit,
  });

  useEffect(() => {
    getTestData();
  }, [testId, projectId]);

  useEffect(() => {
    if (!open) getTestData();
  }, [open]);

  const handleOpen = () => {
    if (pieData.status === "FINISHED") setRestartOpen(true);
    else {
      setOpen(true);
      getDataTableFn();
    }
  };

  const [table, setTable] = useState({});
  const [headColumns, setHeadColumns] = useState({});
  const [bodyColumns, setBodyColumns] = useState({});
  const [preconditions, setPreconditions] = useState([]);

  const caseId = pieData?.cases ? pieData?.cases[0]?.case_id : "";

  const {
    data: { preconditionsQuery = {}, loading: preconditionsLoading } = {},
  } = useQuery(GET_PRECONDITIONS, {
    variables: {
      input: {
        case_id: caseId,
        offset: 0,
        limit: 100,
      },
    },
    onCompleted: setPreconditions,
  });

  function getDataTableFn() {
    const params = {
      limit: 10,
      offset: 0,
      "case-id": pieData?.cases[0]?.case_id,
    };
    dataTableService
      .getDataTable(params)
      .then((res) => {
        setTable(res?.datatables?.[0]);
        if (res?.datatables?.[0]?.columns?.length) {
          const data = res?.datatables?.[0]?.columns?.map((item) => ({
            ...item,
            width: 150,
          }));
          setHeadColumns(data);
        }
        if (res?.datatables?.[0]?.rows?.length) {
          setBodyColumns(
            res?.datatables?.[0]?.rows?.map((item, index) => ({
              ...item,
              index: index + 1,
              titleRef: null,
            }))
          );
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <>
      <div className={cls.wrapper}>
        <div className={cls.left}>
          <FiltersBlock
            styles={{ height: "57px" }}
            children={<TTitle title="Folders" />}
          />
          {loading ? (
            <LinearProgress />
          ) : (
            <>
              {pieData.hasOwnProperty("id") && (
                <TFolders
                  key={pieData?.folder?.id}
                  folder={pieData?.folder}
                  title={pieData?.folder?.title}
                  depth={0}
                  selected={selected}
                  setSelected={setSelected}
                  folderActions={false}
                />
              )}
            </>
          )}
        </div>
        <div className={cls.right}>
          <FiltersBlock
            styles={{ height: "57px" }}
            children={<TTitle title={pieData?.name} />}
            extra={[
              <TButton
                icon={<CloseRoundedIcon />}
                text="Close"
                width="160px"
                bgColor="#fff"
                color="red"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/projects/${projectId}/test-plan/?tab=1`);
                }}
              />,
              <TButton
                icon={<PlayArrow />}
                text={
                  pieData.status === "FINISHED"
                    ? "Restart test"
                    : pieData.status === "STARTED"
                    ? "Resume test"
                    : "Start test"
                }
                width="160px"
                bgColor="#0E73F6"
                color="#fff"
                onClick={handleOpen}
              />,
            ]}
          />
          <div className={cls.pieWrapper}>
            {[pieData]?.map((item) => (
              <TPie
                item={item}
                width={`100%`}
                additionClass={`singlePage`}
                handleOpen={handleOpen}
              />
            ))}
          </div>
        </div>
      </div>

      {open && (
        <Modal
          open={open}
          setOpen={setOpen}
          caseList={pieData.cases}
          not_run={pieData.not_run}
          refetch={getTestData}
          pieData={pieData}
          headColumns={headColumns}
          bodyColumns={bodyColumns}
          preconditions={preconditions}
          preconditionsLoading={preconditionsLoading}
        />
      )}

      {restartOpen && (
        <TModal
          open={restartOpen}
          setOpen={setRestartOpen}
          title="Restart test"
          label="Test Name"
          onSubmit={formik.handleSubmit}
          onChange={formik.handleChange}
          handleReset={formik.handleReset}
          values={formik.values}
        />
      )}
    </>
  );
}
