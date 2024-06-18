import * as Yup from "yup";
import React, {
  useCallback,
  useEffect,
  useState,
  useContext,
  useRef,
} from "react";
import { Formik } from "formik";
import TTitle from "../../TTitle";
import FiltersBlock from "../../../FiltersBlock";
import SearchInput from "../../../SearchInput";
import RectangleIconButton from "../../../Buttons/RectangleIconButton";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import TPie from "../../TPie";
import "../style.scss";
import projectTestService from "../../../../services/projectTestService";
import folderService from "../../../../services/folderService";
import { useParams } from "react-router-dom";
import TButton from "../../TButton";
import { AddRounded } from "@mui/icons-material";
import ListTable from "../ListTable";
import CreateModal from "../CreateModal";
import { useNavigate } from "react-router-dom";
import RingLoader from "../../../Loaders/RingLoader";
import useDebounce from "../../../../hooks/useDebounce";
import {
  GET_CASES_BY_FOLDER_IDS,
  GET_CASE_TAG_LIST,
} from "../../../../apollo/requests/cases/cases";
import { useLazyQuery, useQuery } from "@apollo/client";
import { TestContext } from "../../../../views/TestPlan";

export default function TestSide() {
  const { createTemplate, setCreateTemplate } = useContext(TestContext);
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [folderIds, setFolderIds] = useState([]);

  const [open, setOpen] = useState(false);
  const [view, setView] = useState("grid");
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    passed: "",
    failed: "",
    not_run: "",
    run_date: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(null);
  const [testLoader, setTestLoader] = useState(null);
  const [folders, setFolders] = useState([]);
  const [selectedFolderIds, setSelectedFolderIds] = useState([]);
  // eslint-disable-next-line
  const [getCaseList, { loading: loading2, data: caseList }] = useLazyQuery(
    GET_CASES_BY_FOLDER_IDS
  );
  const [selectedFolders, setSelectedFolders] = useState([]);
  const onSubmit = useCallback(
    (values) => {
      let computedFolders = [];
      folderIds.forEach((item) => {
        let target = computedFolders.find(
          (folder) => folder.folder_id === item.folder_id
        );
        if (target) {
          target.cases.push({
            case_id: item._id,
          });
          return;
        } else {
          computedFolders.push({
            folder_id: item.folder_id,
            cases: [
              {
                case_id: item._id,
              },
            ],
          });
          return;
        }
      });
      const data = {
        ...values,
        folders: computedFolders,
        is_template: createTemplate,
      };
      projectTestService.create(data).then((res) => {
        if (createTemplate) {
          navigate(`/projects/${projectId}/test-plan/?tab=2`);
          navigate(0);
          setOpen(false);
        } else navigate(`/projects/${projectId}/test-plan/${res.id}/?tab=1`);
      });
    },
    [folderIds, navigate, projectId, createTemplate]
  );

  // const formik = useFormik({
  //   initialValues: {
  //     name: "",
  //     folders: [],
  //     full_case: "all",
  //     project_id: projectId,
  //   },
  //   onSubmit: onSubmit,
  //   validationSchema: Yup.object({
  //     name: Yup.string().required("Required"),
  //     project_id: Yup.string().required("Required"),
  //   }),
  // });

  const getItems = () => {
    setTestLoader(true);
    projectTestService
      .getList({
        search: search,
        project_id: projectId,
        limit: 1000,
        offset: 0,
        ...filters,
      })
      .then((res) => {
        setItems(res);
      })
      .finally(() => setTestLoader(false));
  };
  const onDeleteButtonClick = (e, id) => {
    e.stopPropagation();
    projectTestService.delete(id).finally(() => {
      getItems();
    });
  };

  const getFolders = (tags) => {
    setLoading(true);
    folderService
      .getById({ project_id: projectId, tags: tags ?? [] })
      .then((res) => {
        setFolders(JSON.parse(res.folders));
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  const onSearchChange = useDebounce((val) => {
    setSearch(val);
    setCurrentPage(1);
  }, 400);

  useEffect(() => {
    getItems();
    // eslint-disable-next-line
  }, [search, filters]);

  useEffect(() => {
    getFolders();
    // eslint-disable-next-line
  }, [projectId]);

  const handleCases = (element, check) => {
    element?.cases?.forEach((el) => {
      el.checked = check;

      setFolderIds((prev) => {
        if (prev === undefined && check) {
          return [el];
        }
        if (!prev?.find((elm) => elm._id === el._id) && check) {
          return [...prev, el];
        } else if (prev?.find((elm) => elm._id === el._id) && !check) {
          return prev?.filter((elm) => elm.id !== el.id);
        } else return prev;
      });
    });
  };

  const recursiveFn = (check, folder) => {
    if (folder.countCases > 0) folder.checked = check;

    if (!!folder?.existCases && !!folder?.cases?.length) {
      folder.checked = check;
      handleCases(folder, check);
    }

    folder.child_folders.forEach((element) => {
      if (element.countCases > 0) {
        element.checked = check;
      }
      if (element?.cases?.length) {
        handleCases(element, check);
      }

      if (check && element?.existCases) {
        setSelectedFolderIds((prev) => [...prev, element.id]);
      }

      recursiveFn(check, element);
    });

    return folder;
  };

  function hanldeCheckBox(check, folder, parentId) {
    recursiveFn(check, folder ? folder : folders[0]);
    if (!check) {
      setSelectedFolderIds([]);
    }
  }

  // useEffect(() => {
  //   if (selectedFolderIds?.length) {
  //     getCaseList({
  //       variables: {
  //         ids: selectedFolderIds,
  //       },
  //     });
  //   }
  // }, [selectedFolderIds]);

  const formRef = useRef({
    values: {
      name: "",
      folders: [],
      full_case: "all",
      project_id: projectId,
    },
  });

  const onSelectAll = (status) => {
    if (status) {
      formRef.current.setFieldValue("folders", [
        ...formRef.current.values.folders,
        ...caseList?.casesQuery,
      ]);
    } else {
      formRef.current.setFieldValue("folders", []);
    }
  };

  useEffect(() => {
    if (caseList?.casesQuery) {
      onSelectAll(selectedFolderIds?.length > 0 ? true : false);
    }
    // eslint-disable-next-line
  }, [caseList, selectedFolderIds]);

  const { data: { casesTagList = {} } = {} } = useQuery(GET_CASE_TAG_LIST, {
    variables: {
      project_id: projectId,
    },
    skip: formRef.current.values.full_case === "all",
  });

  return (
    <div className="TestSide">
      <FiltersBlock
        styles={{ height: "57px" }}
        children={<TTitle title="Test" />}
        extra={[
          <SearchInput
            icon
            size="small"
            style={{ width: "240px" }}
            onChange={onSearchChange}
          />,
          <RectangleIconButton onClick={() => setView("grid")}>
            <GridViewOutlinedIcon
              sx={{ color: view === "grid" ? "#0564F1" : "#84909A" }}
            />
          </RectangleIconButton>,
          <RectangleIconButton>
            <FormatListBulletedRoundedIcon
              sx={{ color: view === "list" ? "#0564F1" : "#84909A" }}
              onClick={() => setView("list")}
            />
          </RectangleIconButton>,
        ]}
      />

      {testLoader ? (
        <div className="loader-area child-position-center loader">
          <RingLoader />
        </div>
      ) : view === "grid" ? (
        <div>
          {items.Tests?.map((item) => (
            <TPie
              item={item}
              width={"100%"}
              onDeleteButtonClick={onDeleteButtonClick}
            />
          ))}
        </div>
      ) : (
        <div className="list-area">
          <ListTable
            items={items}
            setFilters={setFilters}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}

      <div className="bottom-btns">
        <FiltersBlock
          styles={{ height: "57px", backgroundColor: "#fff" }}
          extra={[
            <TButton
              icon={<AddRounded />}
              text="Create"
              width="160px"
              bgColor="#0E73F6"
              color="#fff"
              onClick={() => {
                setOpen(true);
                setCreateTemplate(false);
              }}
            />,
          ]}
        />
      </div>
      <Formik
        innerRef={formRef}
        initialValues={{
          name: "",
          folders: [],
          full_case: "all",
          project_id: projectId,
        }}
        onSubmit={onSubmit}
        validationSchema={Yup.object({
          name: Yup.string().required("Required"),
          project_id: Yup.string().required("Required"),
        })}
      >
        {({
          setFieldValue,
          handleSubmit,
          handleChange,
          handleReset,
          handleBlur,
          values,
          errors,
          touched,
        }) => (
          <CreateModal
            folders={folders}
            loading={loading}
            setFieldValue={setFieldValue}
            handleBlur={handleBlur}
            open={open}
            setOpen={setOpen}
            onSubmit={handleSubmit}
            onChange={handleChange}
            handleReset={handleReset}
            hanldeCheckBox={hanldeCheckBox}
            values={values}
            title={"Create new Test run"}
            label={"Test name"}
            okText={"Create"}
            casesTagList={casesTagList}
            getFolders={getFolders}
            selectedFolders={selectedFolders}
            setSelectedFolders={setSelectedFolders}
            setFolders={setFolders}
            projectId={projectId}
            folderIds={folderIds}
            setFolderIds={setFolderIds}
            setCreateTemplate={setCreateTemplate}
            createTemplate={createTemplate}
            errors={errors}
            touched={touched}
          />
        )}
      </Formik>
    </div>
  );
}
