const { isArray } = require('lodash/fp');

const REQUEST = '[GraphQl] Request';
const MERGE = '[GraphQl] Merge';
const SET = '[GraphQl] Set';
const DELETE_ALL = '[GraphQl] Delete All';
const DELETE = '[GraphQl] Delete';
const MERGE_ALL = '[GraphQl] Merge All';

const graphqlMergeAll = data => ({
  type: MERGE_ALL,
  payload: {
    data
  }
});

const graphqlMerge = (resourceName, key, data) => ({
  type: MERGE,
  payload: {
    resourceName,
    key,
    data
  }
});

const graphqlSet = (resourceName, key, data) => ({
  type: SET,
  payload: {
    resourceName,
    key,
    data
  }
});

const graphqlDelete = (resourceName, keys, recursive = true) => ({
  type: DELETE,
  payload: {
    resourceName,
    keys: isArray(keys) ? keys : [keys],
    recursive
  }
});

const graphqlDeleteAll = (resourceName, recursive = true) => ({
  type: DELETE_ALL,
  payload: {
    resourceName,
    recursive
  }
});

const graphqlRequest = (query, variables, onSuccess) => ({
  type: REQUEST,
  payload: {
    query,
    variables
  },
  meta: {
    onSuccess
  }
});

const graphqlRequestAction = (query, { onSuccess } = {}) => {
  return variables => graphqlRequest(query, variables, onSuccess);
};

module.exports = {
  REQUEST,
  MERGE,
  SET,
  DELETE_ALL,
  DELETE,
  MERGE_ALL,
  graphqlRequest,
  graphqlRequestAction,
  graphqlMergeAll,
  graphqlMerge,
  graphqlSet,
  graphqlDelete,
  graphqlDeleteAll
};
