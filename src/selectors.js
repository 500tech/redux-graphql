const { isArray, isObject, get } = require('lodash/fp');
const { forEach } = require('lodash');

const keys = [];
const cache = {};

const getOrCache = (state, key, fn) => {
  if (!cache[key]) {
    keys.push(key);
    if (keys.length > 100) {
      keys.unshift();
    }
    cache[key] = {
      state,
      data: fn()
    };
  } else if (cache[key].state !== state) {
    cache[key] = {
      state,
      data: fn()
    };
  }
  return cache[key].data;
};

const denormalize = (state, item, denormalizer) => {
  if (isArray(item)) {
    return denormalizeArray(state, item, denormalizer);
  } else if (isObject(item)) {
    return denormalizeObject(state, item, denormalizer);
  } else {
    return item;
  }
};

const denormalizeArray = (state, items, denormalizer) => {
  return items.map(item => denormalize(state, item, denormalizer));
};

const denormalizeObject = (state, item, denormalizer) => {
  if (item.__redux_resource && denormalizer[item.__redux_resource]) {
    const reference = state[item.__redux_resource][item.key];

    return denormalize(state, reference, denormalizer[item.__redux_resource]);
  }

  const result = {};

  forEach(item, (value, key) => {
    result[key] = denormalize(state, value, denormalizer);
  });
  return result;
};

const selectSingle = (state, resourceName, key, denormalizer = {}) => {
  // TODO: parse denormalizer and select accordingly
  let resource = get([resourceName, key], state);

  return denormalize(state, resource, denormalizer);
};

const selectMulti = (state, resourceName, keys, denormalizer = {}) => {
  return keys.map(key => selectSingle(state, resourceName, key, denormalizer));
};

const selectAll = (state, resourceName, denormalizer = {}) => {
  const allKeys = Object.keys(get(resourceName, state) || {});

  return selectMulti(state, resourceName, allKeys, denormalizer);
};
module.exports = {
  selectSingle,
  selectMulti,
  selectAll
};
