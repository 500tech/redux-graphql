const axios = require('axios');
const { REQUEST, graphqlMergeAll } = require('./actions');

const graphqlMiddleware = ({ dispatch }) => next => action => {
  console.log(JSON.stringify(action, null, 2));
  if (action.type !== REQUEST) {
    return next(action);
  }
  const { query, variables } = action.payload;

  axios
    .post('http://localhost:4000/graphql', {
      query,
      variables
    })
    .then(({ data }) => data.data)
    .then(data => {
      if (action.meta.then) {
        action.meta.then(dispatch);
      } else {
        dispatch(graphqlMergeAll(data));
      }
    });
};

module.exports = graphqlMiddleware;