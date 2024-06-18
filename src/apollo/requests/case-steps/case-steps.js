import { gql } from '@apollo/client';

export const GET_CASE_STEPS = gql`
  query getCaseStepList($input: getCaseStepListRequest!) {
    caseStepsQuery: getCaseStepList(input: $input) {
      id
      title
      case_id
      order_number
      action_id
      action_title
    }
  }
`;

export const CREATE_CASE_STEP = gql`
  mutation createCaseStep($input: createCaseStepRequest!) {
    createCaseStep(input: $input) {
      id
    }
  }
`;

export const DELETE_CASE_STEP = gql`
  mutation deleteCaseStep($ids: [String!]!) {
    deleteCaseStep(ids: $ids)
  }
`;

export const UPDATE_CASE_STEP = gql`
  mutation updateCaseStep($input: updateCaseStepRequest!) {
    updateCaseStep(input: $input) {
      id
    }
  }
`;
