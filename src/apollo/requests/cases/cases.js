import { gql } from "@apollo/client";

export const GET_CASES = gql`
  query getCaseList($input: getCaseListRequest!) {
    casesQuery: getCaseList(input: $input) {
      id
      title
      description
      link
      tags
      folder_id
      order_number
      count_step
    }
  }
`;

export const GET_CASES_BY_FOLDER_IDS = gql`
  query GetCaseListByFolderIds($ids: [String!]!) {
    casesQuery: getCaseListByFolderIds(ids: $ids) {
      id
      title
      folder_id
      order_number
    }
  }
`;

export const CREATE_CASE = gql`
  mutation createCase($input: createCaseRequest!) {
    createCase(input: $input) {
      id
    }
  }
`;

export const DELETE_CASE = gql`
  mutation deleteCase($id: String!) {
    deleteCase(id: $id)
  }
`;

export const DELETE_CASES = gql`
  mutation deleteManyCase($ids: [String!]!) {
    deleteManyCase(ids: $ids)
  }
`;

export const UPDATE_CASE = gql`
  mutation updateCase($input: updateCaseRequest!) {
    updateCase(input: $input) {
      id
    }
  }
`;

export const UPDATE_CASE_STEP_ORDER = gql`
  mutation updateCaseStepOrder($id: String!, $order_number: Int!) {
    updateCaseStepOrder(id: $id, order_number: $order_number) {
      id
    }
  }
`;
export const UPDATE_CASE_ORDER = gql`
  mutation updateCaseOrder($id: String!, $order_number: Int!) {
    updateCaseOrder(id: $id, order_number: $order_number) {
      id
    }
  }
`;

export const COPY_CASES = gql`
  mutation copyManyCase($ids: [String!]!, $folder_id: String!) {
    copyManyCase(ids: $ids, folder_id: $folder_id) {
      id
    }
  }
`;

export const GET_CASE_BY_ID = gql`
  query getCaseByID($id: String!) {
    casesQuery: getCaseByID(id: $id) {
      id
      title
      link
      tags
      description
      test_results {
        test_id
        test_name
        status
        test_date
      }
    }
  }
`;

export const GET_CASE_TAG_LIST = gql`
  query getCaseTagList($project_id: String!) {
    casesTagList: getCaseTagList(project_id: $project_id) {
      tags
    }
  }
`;
