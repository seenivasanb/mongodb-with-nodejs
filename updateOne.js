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


const updateOneDocument = async () => {
    try {
        const filterQuery = { _id: new ObjectId("64c8a8237c2f586d69bd22e1") };
        const updateQuery = { $inc: { balance: 500000 } };

        const collectionName = "accounts";
        const accountCollection = client.db(dbName).collection(collectionName);

        const result = await accountCollection.updateOne(filterQuery, updateQuery);
        console.log("Updated the single document successfully");
        console.log(result);
    } catch (error) {
        console.log("Error updating the single document");
        console.log(error);
    }
}

const main = async () => {
    try {
        await connectToDatabe();
        await updateOneDocument();
    } catch (error) {
        console.log(`Error connecting to the DataBase ${dbName}`);
        console.log(error);
    } finally {
        await client.close();
    }
}

main();