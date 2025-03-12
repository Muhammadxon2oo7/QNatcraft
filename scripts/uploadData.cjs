const algoliasearch = require('algoliasearch').default;

const client = algoliasearch("Y4K6G66HEB", "ced8af34c0de9298ac65bb24c1355e05");

console.log("Algolia connected successfully!");

const index = client.initIndex("movies_index");

const processRecords = async () => {
  const datasetRequest = await fetch(
    "https://dashboard.algolia.com/api/1/sample_datasets?type=movie"
  );

  if (!datasetRequest.ok) {
    throw new Error("Failed to fetch dataset");
  }

  const movies = await datasetRequest.json();
  await index.saveObjects(movies, { autoGenerateObjectIDIfNotExist: true });

  console.log("✅ Successfully indexed objects!");
};

processRecords();
