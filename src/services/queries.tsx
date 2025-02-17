import { gql } from '@apollo/client';

// Queries
export const GET_USERS = gql`
  query {
    getUsers {
      id
      name
      email
      cpf
    }
  }
`;

export const GET_SUPPLIERS = gql`
  query (
    $minKwh: Float,
    $page: Int,
    $limit: Int,
    $user_id: String,
  ) {
    suppliers(
      minKwh: $minKwh,
      page: $page,
      limit: $limit,
      user_id: $user_id,
    ) {
      id
      name
      email
      logo
      state_origin
      cost_per_kWh
      min_kWh_limit
      total_clients
      avg_rating
      userReview {
        rating
      }
    }
  }
`;

export const GET_SUPPLIER_DETAILS = gql`
query getSupplierById($id: Int!) {
  getSupplierById(id: $id) {
    id
    name
    email
    logo
    state_origin
    cost_per_kWh
    min_kWh_limit
    total_clients
    avg_rating
  }
}
`;

export const GET_REVIEW = gql`
query {
  getReview(user_id: "user_id_value", supplier_id: "supplier_id_value") {
    id
    rating
  }
}
`;

export const GET_ALL_CONTRACTS = gql`
  query {
    getAllContracts {
      id
      supplier_id
      user_id
      isActive
      cost_per_kWh
      user_kWh_month
      created_at
    }
  }
`;

export const GET_CONTRACTS_BY_USER_ID = gql`
  query getAllContractsByUserId($user_id: String!) {
    getAllContractsByUserId(user_id: $user_id) {
      id
      supplier_id
      supplier_name
      user_id
      user_name
      isActive
      cost_per_kWh
      user_kWh_month
      created_at
    }
  }
`;

export const GET_CONTRACTS_BY_SUPPLIER_ID = gql`
  query getAllContractsBySupplierId(
    $supplier_id: Int!,
    $page: Int,
    $limit: Int,
  ) {
    getAllContractsBySupplierId(
      supplier_id: $supplier_id,
      page: $page,
      limit: $limit,
    ) {
      id
      supplier_id
      supplier_name
      user_id
      user_name
      isActive
      cost_per_kWh
      user_kWh_month
      created_at
    }
  }
`;

// Mutations
export const CREATE_USER = gql`
  mutation createUser($input: CreateUserDto!) {
    createUser(createUserDto: $input) {
      user {
        id
        name
        email
        cpf
      }
      token
    }
  }
`;

export const LOGIN_USER = gql`
  mutation loginUser($input: LoginUserDto!) {
    loginUser(loginUserDto: $input) {
      user {
        id
        name
        email
        cpf
      }
      token
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser($input: UpdateUserDto!) {
    updateUser(updateUserDto: $input) {
      id
      name
      email
      cpf
    }
  }
`;

export const CREATE_SUPPLIER = gql`
  mutation createSupplier($input: CreateSupplierDto!) {
    createSupplier(createSupplierDto: $input) {
      supplier {
        id
        name
        email
        logo
        state_origin
        cost_per_kWh
        min_kWh_limit
        total_clients
        avg_rating
      }
      token
    }
  }
`;

export const UPDATE_SUPPLIER = gql`
  mutation updateSupplier($id: Int!, $input: UpdateSupplierDto!) {
    updateSupplier(id: $id, updateSupplierDto: $input) {
      id
      name
      logo
      state_origin
      cost_per_kWh
      min_kWh_limit
      total_clients
      avg_rating
    }
  }
`;

export const LOGIN_SUPPLIER = gql`
  mutation loginSupplier($input: SupplierLoginDto!) {
    loginSupplier(supplierLoginDto: $input) {
      supplier {
        id
        name
        email
        logo
        state_origin
        cost_per_kWh
        min_kWh_limit
        total_clients
        avg_rating
      }
      token
    }
  }
`;

export const CREATE_CONTRACT = gql`
  mutation createContract($input: CreateContractInput!) {
    createContract(createContractInput: $input) {
      id
      supplier_id
      user_id
      isActive
      cost_per_kWh
      user_kWh_month
      created_at
    }
  }
`;

export const DEACTIVATE_CONTRACT = gql`
  mutation deactivateContract($id: Int!) {
    deactivateContract(id: $id) {
      id
      supplier_id
      user_id
      isActive
      cost_per_kWh
      user_kWh_month
      created_at
    }
  }
`;

export const CREATE_REVIEW = gql`
mutation createReview($createReviewInput: CreateReviewInput!) {
  createReview(createReviewInput: $createReviewInput) {
    id
    user_id
    supplier_id
    rating
    createdAt
    updatedAt
  }
}
`;
