# redux-graphql

Redux GraphQL Integration

# Running demo (NodeJS)

```
$ npm run server
$ npm run demo
```

# Brainstorming

# install

`npm i -S redux-graphql`  
`npm i -S regraph`

# usage

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

# normalizing

To be able to normalize we need to know for each resource if it should be normalized and by which key.
Maybe use special alias in graphql query to denote the key (can you have both an alias and the original attribute)?
For example:

```graphql
query getCampaigns() {
  campaigns {
    id
    __redux_key: id
    title
    description
    publishers {
      name
      __redux_key: name
      campaignId
      __foreign_key_campaigns: campaignId
      budget
      ads {
        id
        __redux_key: id
        publisherId
        __foreign_key_publishers: publisherId
        campaignId
        __foreign_key_campaign: campaignId
        image {
          // doesn't normalize
          id
          url
          width
          height
        }
      }
    }
  }
}
```
