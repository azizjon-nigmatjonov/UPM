import { gql } from '@apollo/client';

export const GET_PRECONDITIONS = gql`
  query getPrecondition ($input:  getPreConditionListRequest!) {
    preconditionsQuery: getPreConditionList(input: $input) {
    case_id, 
    title, 
    id, 
    order_number
  }
} 
`;

export const CREATE_PRECONDITION = gql`
  mutation createPreCondition($input: createPreConditionRequest!) {
    createPreCondition(input: $input) {
      id
    }
  }
`;

export const DELETE_PRECONDITION = gql`
  mutation deletePreCondition($id: String!) {
    deletePreCondition(id: $id)
  }
`;

export const UPDATE_PRECONDITION = gql`
  mutation updatePreCondition($input: updatePreConditionRequest!) {
    updatePreCondition(input: $input) {
      id
    }
  }
`;

export const UPDATE_PRECONDITION_ORDER = gql`
   mutation updatePreConditionOrder($id: String!, $order_number: Int!) {
    updatePreConditionOrder(id: $id, order_number: $order_number) {
      id
    }
  }
`;


