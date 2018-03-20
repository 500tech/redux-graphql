const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Image {
    id: String
    url: String
    width: Int
    height: Int
  }

  type Ad {
    id: String
    publisherId: String
    campaignId: String
    image: Image
  }

  type Publisher {
    id: String
    name: String
    budget: Float
    campaignId: String
    ads: [Ad]
  }

  type Campaign {
    id: String
    title: String
    budget: Float
    publishers: [Publisher]
  }

  input CampaignInput {
    title: String
    budget: Float
  }

  type Query {
    campaign(id: String): Campaign
    campaigns: [Campaign]
  }

  type Mutation {
    createCampaign(campaign: CampaignInput): Campaign
  }
  `);

// The root provides a resolver function for each API endpoint

const campaign1 = {
  id: '1',
  title: 'Campaign 1',
  budget: 100000,
  publishers: [
    {
      id: '18',
      name: 'Google',
      budget: 40000,
      campaignId: '1',
      ads: [
        {
          id: '234',
          publisherId: '18',
          campaignId: '1',
          image: {
            id: '1234',
            url: 'http://image.com',
            width: 150,
            height: 150
          }
        }
      ]
    }
  ]
}
const campaign2 = {
  id: '2',
  title: 'Campaign 2',
  budget: 100000,
  publishers: [
    {
      id: '19',
      name: 'Google',
      budget: 40000,
      campaignId: '2',
      ads: [
        {
          id: '235',
          publisherId: '19',
          campaignId: '2',
          image: {
            id: '12345',
            url: 'http://image.com',
            width: 150,
            height: 150
          }
        }
      ]
    }
  ]
}

const campaigns = {
  '1': campaign1,
  '2': campaign2
}

const root = {
  campaign: ({id}) => {
    return campaigns[id];
  },
  campaigns: () => {
    return [campaign1, campaign2];
  },
  createCampaign: ({campaign}) => {
    return campaign1;
  }
};

const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
