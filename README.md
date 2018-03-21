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
We use an alias in graphql query to denote the key `__redux_key`
we also query `__typename` to know under which resource to store the results.

For example:

```graphql
query getCampaigns() {
  campaigns {
    id
    __typename
    __redux_key: id
    title
    description
    publishers {
      name
      __typename
      __redux_key: name
      campaignId
      __foreign_key_campaigns: campaignId
      budget
      ads {
        id
        __redux_key: id
        __typename
        publisherName
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

Will be stored like so:
```js
{
  Campaign: {
    1: {
      id: 1,
      __typename: 'Campaign',
      __redux_key: 1,
      title: '...',
      description: '...',
      publishers: [
        { __redux_resource: 'Publisher', key: 'Google' },
        { __redux_resource: 'Publisher', key: 'Facebook' }
      ]
    }
  },
  Publisher: {
    Google: {
      name: 'Google',
      __typename: 'Publisher',
      __redux_key: 'Google',
      campaignId: 1,
      __foreign_key_Campaign: 1,
      budget: 1000,
      ads: [
        { __redux_resource: 'Ad', key: 1 }
      ]
    },
    Facebook: {...}
  },
  Ad: {
    id: 1,
    __redux_key: 1,
    __typename: 'Ad',
    publisherName: 'Google',
    __foreign_key_Publisher: 'Google'
    campaignId: 1,
    __foreign_key_Campaign: 1,
    image: {
      id: 1,
      url: 'http://my.image',
      width: 100,
      height: 100
    }
  }
}
```

# Denormalizing using selectors
Denormalizing using the same graphql strings to instruct the selector which parts should be denormalized.
For example:
```
const denormalizer = {
  Publisher: {}
}

selectGrahpql(state, 'Campaign', 1, denormalizer) // using above state
```
Will produce the denormalized object:
```
{
  id: 1,
  __typename: 'Campaign',
  __redux_key: 1,
  title: '...',
  description: '...',
  publishers: [
    {
      name: 'Google',
      __typename: 'Publisher',
      __redux_key: 'Google',
      campaignId: 1,
      __foreign_key_Campaign: 1,
      budget: 1000,
      ads: [
        { __redux_resource: 'Ad', key: 1 }
      ]
    },
    { ... }
  ]
}
```
