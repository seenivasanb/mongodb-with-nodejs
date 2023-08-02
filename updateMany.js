const { MongoClient, ObjectId } = require("mongodb");
const uri = require("./atlas_uri");

console.log(uri);

const client = new MongoClient(uri);

const dbName = "bank";

const connectToDatabe = async () => {
    try {
        await client.connect();
        console.log(`Connect to the DB ${dbName} Successfully`);
    } catch (error) {
        console.log(`Error connecting to the DB ${dbName}`);
        console.log(error);
    }
}


const updateManyDocument = async () => {
    try {
        const filterQuery = { account_type: "checking" };
        const updateQuery = { $push: { transfers_complete: "TR212312" } };

        const collectionName = "accounts";
        const accountCollection = client.db(dbName).collection(collectionName);

        const result = await accountCollection.updateMany(filterQuery, updateQuery);
        console.log("Updated the single document successfully");
        console.log("Updated Count: ", result.modifiedCount);
    } catch (error) {
        console.log("Error updating the single document");
        console.log(error);
    }
}

const main = async () => {
    try {
        await connectToDatabe();
        await updateManyDocument();
    } catch (error) {
        console.log(`Error connecting to the DataBase ${dbName}`);
        console.log(error);
    } finally {
        await client.close();
    }
}

main();