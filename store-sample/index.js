const { createStore, applyMiddleware } = require('redux');
const {
  reducer,
  middleware,
  graphqlRequestAction,
  graphqlMerge,
  graphqlSet,
  graphqlDelete,
  graphqlDeleteAll
} = require('../src');

const store = createStore(reducer, {}, applyMiddleware(middleware));

const getCampaignsQuery = `query getCampaigns {
  campaigns {
    id
    __typename
    __redux_key:id
    title
    publishers {
      __typename
      __redux_key:id
      id
    }
  }
}`;

const getCampaignQuery = `query($id:String) {
  campaign(id:$id) {
    id
    __typename
    __redux_key:id
    title
    budget
    publishers {
      __typename
      __redux_key:id
      id
      name
      budget
      campaignId
      ads {
        __typename
        __redux_key:id
        id
        image {
          __typename
          __redux_key:id
          id
          url
        }
      }
    }
  }
}`;
const getCampaigns = graphqlRequestAction(getCampaignsQuery);
const getCampaign = graphqlRequestAction(getCampaignQuery);

store.subscribe(() => console.log(JSON.stringify(store.getState(), null, 2)));

store.dispatch(getCampaign({ id: '1' }));
store.dispatch(getCampaigns());
setTimeout(() => {
  store.dispatch(
    graphqlSet('Campaign', 10, { name: 'custom campaign', budget: 1000 })
  );
  store.dispatch(
    graphqlSet('Campaign', 10, { name: 'another custom campaign' })
  );
  store.dispatch(graphqlMerge('Campaign', 10, { budget: 2000 }));
  store.dispatch(graphqlDelete('Campaign', 10));
  store.dispatch(graphqlMerge('Campaign', 11, { name: 'campaign11' }));
  store.dispatch(graphqlMerge('Campaign', 12, { name: 'campaign12' }));
  store.dispatch(graphqlMerge('Campaign', 13, { name: 'campaign13' }));
  store.dispatch(graphqlMerge('Campaign', 14, { name: 'campaign14' }));
  store.dispatch(graphqlDelete('Campaign', [11, 12]));
  store.dispatch(graphqlDeleteAll('Campaign'));
}, 500);
