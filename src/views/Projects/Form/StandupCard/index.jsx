import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormCard from "../../../../components/FormCard";
import RingLoaderWithWrapper from "../../../../components/Loaders/RingLoader/RingLoaderWithWrapper";
import projectService from "../../../../services/projectService";
import StandupRow from "./StandupRow";

const StandupCard = () => {
  const { projectId } = useParams();
  const [loader, setLoader] = useState(true);
  const [standups, setStandups] = useState(null);

  const fetchStandup = () => {
    setLoader(true);
    projectService
      .getProjectStandup(projectId)
      .then((res) => {
        setStandups(res?.items);
      })
      .catch((error) => {
        console.log("ERROR ==>", error);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    fetchStandup();
  }, []);
  
  return (
    <div>
      <FormCard visible title="Stand-up setup">
        {loader ? (
          <RingLoaderWithWrapper />
        ) : (
          <div className="StatusGroup silver-bottom-border">
            <div className="status-list">
              {standups?.map((standup) => (
                <StandupRow key={standup.id} standup={standup} />
              ))}
            </div>
          </div>
        )}
      </FormCard>
    </div>
  );
};

export default StandupCard;
