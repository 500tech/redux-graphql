const reducer = require('./reducer');
const middleware = require('./middleware');
const actions = require('./actions');
const selectors = require('./selectors');

module.exports = {
  reducer,
  middleware,
  ...actions,
  ...selectors
};
