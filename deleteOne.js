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


const deleteOneDocument = async () => {
    try {
        const filterQuery = { _id: new ObjectId("64c8a8237c2f586d69bd22e1") };

        const collectionName = "accounts";
        const accountCollection = client.db(dbName).collection(collectionName);

        const result = await accountCollection.deleteOne(filterQuery);
        console.log("Deleted the single document successfully");
        console.log(result);
    } catch (error) {
        console.log("Error deleting the single document");
        console.log(error);
    }
}

const main = async () => {
    try {
        await connectToDatabe();
        await deleteOneDocument();
    } catch (error) {
        console.log(`Error connecting to the DataBase ${dbName}`);
        console.log(error);
    } finally {
        await client.close();
    }
}

main();