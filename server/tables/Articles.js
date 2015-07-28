"use strict";

module.exports = {
  AttributeDefinitions: [
    { AttributeName: "id", AttributeType: "S" },
    { AttributeName: "dayMark", AttributeType: "S" },
    { AttributeName: "createdAt", AttributeType: "N" }
  ],
  KeySchema: [
    { AttributeName: "id", KeyType: "HASH"}
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1
  },
  TableName: "Articles",
  GlobalSecondaryIndexes: [
    {
      IndexName: "DateIndex", // required
      KeySchema: [ // required
        { AttributeName: "dayMark", KeyType: "HASH"},
        { AttributeName: "createdAt", KeyType: "RANGE"}
        // ... more items ...
      ],
      Projection: { // required
        ProjectionType: "ALL"
      },
      ProvisionedThroughput: { // required
        ReadCapacityUnits: 1, // required
        WriteCapacityUnits: 1 // required
      }
    },
    {
      IndexName: "CreatedIndex", // required
      KeySchema: [ // required
        { AttributeName: "createdAt", KeyType: "HASH"}
        // ... more items ...
      ],
      Projection: { // required
        ProjectionType: "ALL"
      },
      ProvisionedThroughput: { // required
        ReadCapacityUnits: 1, // required
        WriteCapacityUnits: 1 // required
      }
    }
  ]
};
