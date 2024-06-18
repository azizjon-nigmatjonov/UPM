import {
  Step,
  StepConnector,
  stepConnectorClasses,
  StepLabel,
  Stepper,
  styled,
} from "@mui/material"
import { useMemo } from "react"
import { useSelector } from "react-redux"
import CheckIcon from '@mui/icons-material/Check';

const SprintStepper = ({ selectedStep, currentStep, sprintStepsList, setSelectedStepId }) => {
  const globalStepsList = useSelector((state) => state.project.sprintStepsList)

  const computedStepsList = useMemo(() => {
    return globalStepsList?.map((step) => ({
      ...step,
      confirmed: Boolean(
        sprintStepsList.find((el) => el.project_sprint_step_id === step.id)
          ?.confirmed
      ),
    }))
  }, [globalStepsList, sprintStepsList])

  const currentStepIndex = computedStepsList?.findIndex(
    (step) => step.id === currentStep?.project_sprint_step_id
  )

  const selectedStepIndex = computedStepsList?.findIndex(
    (step) => step.id === selectedStep?.project_sprint_step_id
  )

  const clickHandler = (index) => {
    if(sprintStepsList[index]) setSelectedStepId(sprintStepsList[index]?.id)
  }

  return (
    <div className="SprintStepper">
      <Stepper
        activeStep={currentStepIndex}
        alternativeLabel
        connector={<QontoConnector />}
      >
        {computedStepsList?.map((step, index) => (
          <Step key={step.id}  >
            <StepLabel
              onClick={() => {clickHandler(index)}}
              StepIconProps={{
                isSelected: selectedStepIndex === index,
                isCurrent: currentStepIndex === index,
                confirmed: step.confirmed,
                index,
              }}
              StepIconComponent={LockedStep}
              className="label"
            >
              <div className={selectedStepIndex === index ? 'selected' : ''}>{step.title}</div>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  )
}

const LockedStep = ({ active, completed, isSelected, confirmed, index, isCurrent }) => {


  if (confirmed) {
    return (
      <div className={`Step locked ${isSelected ? 'selected' : ''}`}>
        <div className="icon-wrapper">
          <CheckIcon />
        </div>
      </div>
    )
  }

  if (isCurrent) {
    return (
      <div className={`Step active ${isSelected ? 'selected' : ''}`}>
        <div className="icon-wrapper">
        {index + 1}
        </div>
      </div>
    )
  }

  return (
    <div className="Step">
      <div className="icon-wrapper">{index + 1}</div>
    </div>
  )
}

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 20,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#0067F4",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#0067F4",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
}))

export default SprintStepper
