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

const findOneDocument = async () => {
    try {
        const findAccount = { _id: new ObjectId("64c8b757e2d5608ebe12475d") };

        const collectionName = "accounts";
        const accountCollection = client.db(dbName).collection(collectionName);

        const result = await accountCollection.findOne(findAccount);
        console.log("Find a single document successfully");
        console.log(result);
    } catch (error) {
        console.log("Error finding the single document");
        console.log(error);
    }
}

const main = async () => {
    try {
        await connectToDatabe();
        await findOneDocument();
    } catch (error) {
        console.log(`Error connecting to the DataBase ${dbName}`);
        console.log(error);
    } finally {
        await client.close();
    }
}

main();