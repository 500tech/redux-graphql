const reducer = require('./reducer');
const middleware = require('./middleware');
const actions = require('./actions');

module.exports = {
  reducer,
  middleware,
  ...actions
};
