import { gql } from '@apollo/client';

export const CREATE_FOLDER = gql`
  mutation createFolder($input: createFolderRequest!) {
    createFolder(input: $input) {
      id
    }
  }
`;

export const DELETE_FOLDER = gql`
  mutation deleteFolder($id: String!) {
    deleteFolder(id: $id)
  }
`
export const DELETE_FOLDERS = gql`
  mutation deleteManyFolder($ids: [String!]!) {
    deleteManyFolder(ids: $ids)
  }
`

export const UPDATE_FOLDER = gql`
  mutation updateFolder($input: updateFolderRequest!) {
    updateFolder(input: $input) {
      id
    }
  }
`
export const COPY_FOLDERS = gql`
  mutation copyManyFolder($ids: [String!]!, $parent_folder_id: String!) {
    copyManyFolder(ids: $ids, parent_folder_id: $parent_folder_id) {
      id
    }
  }
`
