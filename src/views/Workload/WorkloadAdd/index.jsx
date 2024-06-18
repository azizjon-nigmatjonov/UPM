import React, { useEffect, useMemo, useState } from "react";
import "../workload.scss";
import { ArrowForwardIos, ArrowBackIos, Delete } from "@mui/icons-material";
import StaticTable from "../../../components/Table";
import { ChevronTopIcon, ChevronBottomIcon } from "../../../assets/icons/icons";
import workloadService from "../../../services/workloadService";
import useDebounce from "../../../hooks/useDebounce";
import developerService from "../../../services/developerService";
import Tooltip from "@mui/material/Tooltip";

export default function WorkloadAdd({
  users,
  fromDate,
  statusNumber,
  developerObj
}) {
  const [projects, setProjects] = useState({});
  const [isHoverDelete, setIsHoverDelete] = useState("");
  const [headColums, setHeadColumns] = useState([])
  const [given, setGiven] = useState(0);

  function getworkloadData() {
    const params = {
      "from-date": fromDate,
      "role-id": users?.role?.role_id,
    };
    workloadService.getWorkloadDevelopersList(params).then((res) => {
      setProjects(res);
      setPorjectsTableHeadCols()
    });
  }

  const updateGiven = useDebounce((ID, userId, givenType, val) => {
    developerService
      .uptadeDevGiven({
        id: ID,
        user_id: userId,
        given: givenType
          ? givenType === "ADD"
            ? Number(given) + 0.25 > 1
              ? 1
              : Number(given) + 0.25
            : Number(given) - 0.25 < 0
            ? 0
            : Number(given) - 0.25
          : Number(val),
      })
      .then((res) => {
        getworkloadData();
      })
  }, 400);

  const deleteDeveloper = useDebounce((devId) => {
    developerService
      .deleteDev(devId)
      .then(() => {
        getworkloadData();
      })
  }, 300);

  const postDeveloper = useDebounce((plan, depId, user) => {
    if (!user?.user_id) return;
    setHeadColumns([])
    developerService
      .postDev({
        department_id: depId,
        devs: [
          {
            given: plan - user?.given,
            user_id: user?.user_id,
          },
        ],
      })
      .then(() => {
        getworkloadData();
      })
  }, 300)

  const bodyColumns = useMemo(() => {
    return (
      projects.projects?.map((item, ind) => ({
        index: ind + 1,
        ...item,
      })) ?? []
    );
  }, [projects]);

  useEffect(() => {
    if (developerObj?.user_id) {
      setProjects([]);
      getworkloadData();
    }
  }, [developerObj, fromDate]);

  function getDeveloperAddVal (val1, val2) {
    let res = val1 -
    val2?.reduce(
      (acc, curr) => acc + curr?.given,
      0
    )
    return parseInt(res)
  }

  function setPorjectsTableHeadCols () {
      setHeadColumns([
        {
          title: "№",
          key: "index",
          width: 10,
        },
        {
          title: "Projects",
          key: ["project_name", "plan", "fact"],
          render: (val) => (
            <div className="workloadProjects">
              <p>{val[0]}</p>
              <div className={`content ${statusNumber(val)}`}>
                {`${val[1]}/${val[2]}`}
              </div>
            </div>
          ),
        },
        {
          title: "Developers",
          key: ["plan", "fact", "departments"],
          render: (val) => (
            <div className="workloadDevelopers">
              <div className="wrapper">
                <div className="left">
                  <div className="plan">
                    <ChevronTopIcon />
                    <div>
                      <input type="text" readOnly value={val[2][0]?.plan} />
                    </div>
                    <ChevronBottomIcon />
                  </div>
                </div>
                <div className="right">
                    <div>
                      {val[2][0]?.devs?.length
                      ? val[2][0]?.devs.map((developer) => (
                          <div key={developer.id + developer?.user_name}>
                            <div
                              className="developer"
                              onMouseEnter={() => setIsHoverDelete(developer?.id)}
                              onMouseLeave={() => setIsHoverDelete(null)}
                            >
                              <div>
                                <span style={{ position: "relative", paddingRight: "30px" }}>
                                <Tooltip
                                  className="tooltip"
                                  placement="top-start"
                                  title={developer?.user_name}
                                >
                                  <span className="dev_name">
                                    {developer?.user_name}
                                  </span>
                                </Tooltip>
                                {isHoverDelete === developer?.id && (
                                <div className="delete">     
                                    <Delete
                                      style={{ color: "#f76659" }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteDeveloper(developer?.id);
                                      }}
                                    />
                                </div>
                                )}
                                </span>
                              </div>
                              <div
                                className="statusUpdate"
                                onMouseEnter={() => {
                                  setGiven(developer?.given);
                                }}
                              >
                                <span 
                                    className="leftBorder box" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setGiven((prev) =>
                                        Number(prev) - 0.25 > 0
                                          ? Number(prev) - 0.25
                                          : 0
                                      );
                                      updateGiven(
                                        developer?.id,
                                        developer?.user_id,
                                        "SUB"
                                      );
                                    }}
                                  >
                                  <ArrowBackIos style={{ marginLeft: "2px" }} />
                                </span>
                                <input value={given ? given : developer?.given} type="text" className="center" readOnly />
                                <span 
                                  className="rightBorder box" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setGiven((prev) =>
                                      prev < 1
                                        ? Number(prev) + 0.25 > 1
                                          ? 1
                                          : Number(prev) + 0.25
                                        : prev
                                    );
                                    updateGiven(
                                      developer?.id,
                                      developer?.user_id,
                                      "ADD"
                                    );
                                  }}
                                  >
                                  <ArrowForwardIos />
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      : ""}
                    </div>
                    {val[2][0]?.plan -
                      val[2][0]?.devs?.reduce(
                        (acc, curr) => acc + curr?.given,
                        0
                      ) > 0 ? (
                        <div style={{ cursor: 'pointer' }} onClick={(e) => {
                          e.preventDefault()
                          postDeveloper(val[2][0]?.plan, val[2][0]?.id, developerObj)
                        }}>
                          Add developer ({val[2][0]?.plan -
                      val[2][0]?.devs?.reduce(
                        (acc, curr) => acc + curr?.given,
                        0
                      )})
                        </div>
                      ) : !val[2][0]?.devs?.length && (
                        <div className="line"></div>
                      )}
                  </div>
              </div>
            </div>
          ),
        },
      ])
  }

  useEffect(() => {
    setPorjectsTableHeadCols()
  }, [isHoverDelete])
  return (
    <>
      <div className="users-table">
        <StaticTable
          headColumns={headColums ?? []}
          bodyColumns={bodyColumns}
          nullData={!bodyColumns?.length}
          bodyHover={false}
          heightFit={true}
        />
      </div>
    </>
  );
}
