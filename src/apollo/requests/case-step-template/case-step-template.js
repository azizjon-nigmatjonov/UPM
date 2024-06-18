import { gql } from "@apollo/client";

export const GET_CASE_STEP_TEMPLATE_LIST = gql`
  # get case step template list
  query getCaseStepTemplateList($input: getCaseStepTemplateListRequest) {
    getCaseStepTemplateList(input: $input) {
      id
      name
      case_steps {
        id
        action_id
        case_id
        title
      }
    }
  }
`;
export const CREATE_CASE_STEP_TEMPLATE_REQUEST = gql`
  # create case step template
  mutation createCaseStepTemplate($input: createCaseStepTemplateRequest!) {
    createCaseStepTemplate(input: $input) {
      id
      name
      case_steps {
        id
        title
        case_id
      }
    }
  }
`;
export const GET_CASE_STEP_TEMPLATE_BY_ID = gql`
  # get case step template list
  query getCaseStepTemplateByID($id: String!) {
    getCaseStepTemplateByID(id: $id) {
      id
      name
      case_steps {
        id
        title
        action_id
        case_id
        order_number
        action_title
      }
    }
  }
`;

export const CREATE_CASE_STEP_TEMPLATE = gql`
  mutation createCaseStepTemplate($input: createCaseStepTemplateRequest!) {
    createCaseStepTemplateRequest(input: $input) {
      id
      name
      case_steps {
        id
        title
        action_id
        case_id
        order_number
        action_title
      }
    }
  }
`;
export const UPDATE_CASE_STEP_TEMPLATE = gql`
  mutation updateCaseStepTemplate($input: updateCaseStepTemplateRequest) {
    updateCaseStepTemplate(input: $input) {
      id
      name
      case_steps {
        id
        title
        case_id
      }
    }
  }
`;
export const DELETE_CASE_STEP_TEMPLATE = gql`
  mutation deleteCaseStepTemplate($id: String!) {
    deleteCaseStepTemplate(id: $id)
  }
`;
