const {
  isArray,
  isObject,
  some,
  setWith,
  merge,
  set,
  update,
  omit
} = require('lodash/fp');
const { forEach } = require('lodash');
const { SET, DELETE, DELETE_ALL, MERGE, MERGE_ALL } = require('./actions');
const { handleActions } = require('redux-actions');

const normalize = (item, state, label) => {
  if (isArray(item)) {
    return normalizeArray(item, state, label);
  } else if (isObject(item)) {
    return normalizeObject(item, state, label);
  } else {
    return item;
  }
};

const normalizeArray = (data, state, label) => {
  let wasExtracted = false;

  return data.map(item => {
    const normazliedItem = normalize(item, state, label);

    // If one item is undefined (meaning it's on the state), then array should be on the state too
    return normazliedItem;
  });
};

const normalizeObject = (item, state, label) => {
  let result = {};

  forEach(item, (value, key) => {
    const normalizedItem = normalize(value, state, key);

    result[key] = normalizedItem;
  });

  if (item.__redux_key) {
    if (!item.__typename) {
      throw 'Must include __typename in the query when including __redux_key';
    }
    // put normalized object on state, don't return it
    state[item.__typename] = state[item.__typename] || {};
    state[item.__typename][item.__redux_key] = result;

    return {
      key: item.__redux_key,
      __redux_resource: item.__typename
    };
  }
  return result;
};
const reducer = handleActions(
  {
    [MERGE]: (state, action) => {
      return update(
        [action.payload.resourceName, action.payload.key],
        merge(action.payload.data),
        state
      );
    },
    [SET]: (state, action) => {
      // don't change to set([action.payload.resourceName, action.payload.key])
      // because then keys that are numbers are treated as array indices for new resources
      return update(
        action.payload.resourceName,
        set(action.payload.key, action.payload.data),
        state
      );
    },
    [DELETE]: (state, action) => {
      // TODO: action.payload.recursive.
      return update(
        action.payload.resourceName,
        omit(action.payload.keys),
        state
      );
    },
    [DELETE_ALL]: (state, action) => {
      // TODO: action.payload.recursive.
      return set(action.payload.resourceName, {}, state);
    },
    [MERGE_ALL]: (state, action) => {
      const flattenned = {};

      forEach(action.payload.data, (value, key) => {
        normalize(value, flattenned, key);
      });

      return merge(state, flattenned);
    }
  },
  {}
);

module.exports = reducer;
