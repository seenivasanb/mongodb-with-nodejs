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


const deleteManyDocuments = async () => {
    try {
        const filterQuery = { balance: { $lt: 500 } };

        const collectionName = "accounts";
        const accountCollection = client.db(dbName).collection(collectionName);

        const result = await accountCollection.deleteMany(filterQuery);
        console.log("Deleted the many document successfully");
        console.log("Deleted Count:", result.deletedCount);
    } catch (error) {
        console.log("Error deleting the many document");
        console.log(error);
    }
}

const main = async () => {
    try {
        await connectToDatabe();
        await deleteManyDocuments();
    } catch (error) {
        console.log(`Error connecting to the DataBase ${dbName}`);
        console.log(error);
    } finally {
        await client.close();
    }
}

main();