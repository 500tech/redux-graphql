# redux-graphql
Redux GraphQL Integration

# install (suggestions)
npm i -S redux-graphql
npm i -S regraph

# usage (experimenting)
1)
```javascript
// rootReducer.js
import { graphqlReducer } from 'redux-graphql';

rootReducer = combineReducers({
  graph: graphqlReducer()
});

// store
import { graphqlMiddleware } from 'redux-graphql';
middelwares = [
 ...,
 graphqlMiddleware
];

// actions
import { graphqlActionCreator, graphqlSet } from 'redux-graphql';
import getCampaignsQuery from './queries/get-campaigns.gql';
import createCampaignsQuery from './queries/create-campaign.gql';

export const getCampaigns = graphqlActionCreator(getCampaignsQuery);

// Either set the data after create:
export const createCampaign = graphqlActionCreator(createCampaignsQuery, {
  then: (data, dispatch) => dispatch(graphqlSet({ resource: 'campaigns', id: data.id, data }))
});

// Or call get campaigns again:
const createCampaign = graphqlActionCreator(getCampaignsQuery, {
  then: (data, dispatch) => dispatch(getCampaigns())
});

// component
import { graphqlClear } from 'redux-graphql';
import { getCampaigns, createCampaign } from './actions/campaign-actions';

class CampaignsList extends React.Component {
  componentDidMount() {
    // get / refresh data
    this.props.getCampaigns();
  }
  componentWillUnmount() {
    // clear data
    this.props.graphqlClear('campaigns');
  }
  onCreate(campaignData) {
    this.props.createCampaign({ campaign: campaignData }); // Whatever is passed to the action will be used as variables
  }
  render() {
    { this.props.filteredCampaigns.map(...) }
  }
}

const mapStateToProps = (state) => {
  filteredCampaigns: selectFilteredCampaigns(state)
};
export default connect(mapStateToProps, {
  getCampaigns,
  graphqlClear
})(CampaignsList);

// selector
import { graphqlSelect } from 'redux-graphql';
import { createSelector } from 'reselect';

export const selectFilteredCampaigns = createSelector(
  graphqlSelect('campaigns'),
  get('ui.filter'),
  (campaigns, filter) => ...
);
```
