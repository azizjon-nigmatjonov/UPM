import { gql } from "@apollo/client"

export const GET_USERS = gql`
  query GetUserList($offset: Int, $limit: Int, $search: String) {
    usersQuery: getUserList(
      input: { offset: $offset, limit: $limit, search: $search }
    ) {
      users {
        id
        name
        email
        client_platform_id
      }
      count
    }
  }
`

export const DELETE_USER = gql`
  mutation deleteUser($id: String!) {
    deleteUser(id: $id)
  }
`

export const CREATE_USER = gql`
  mutation createUser($input: CreateUserRequest!) {
    createUser(input: $input) {
      id
    }
  }
`

export const UPDATE_USER = gql`
  mutation updateUser($input: UpdateUserRequest!) {
    updateUser(input: $input) {
      id
    }
  }
`

// export const CREATE_USER = gql`
//   mutation deleteUser(
//     $project_id: String!
//     $client_platform_id: String!
//     $client_type_id: String!
//     $role_id: String!
//     $name: String!
//     $phone: String!
//     $email: String!
//     $login: String!
//     $password: String!
//     $active: Int!
//     $photo_url: String!
//     $expires_at: String!
//   ) {
//     createUser(
//       input: {
//         project_id: $project_id
//         client_platform_id: $client_platform_id
//         client_type_id: $client_type_id
//         role_id: $role_id
//         name: $name
//         phone: $phone
//         email: $email
//         login: $login
//         password: $password
//         active: $active
//         photo_url: $photo_url
//         expires_at: $expires_at
//       }
//     ) {
//       id
//     }
//   }
// `
