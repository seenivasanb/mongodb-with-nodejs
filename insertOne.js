const { MongoClient } = require("mongodb");
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

const insertNewAccount = async () => {
    try {

        const newAccount = {
            account_holder: "Seeni",
            account_id: "654321",
            account_type: "checking",
            balance: 100000,
            last_updated: new Date()
        }

        const collectionName = "accounts";
        const accountCollection = client.db(dbName).collection(collectionName);

        const result = await accountCollection.insertOne(newAccount);
        console.log("New document inserted successfully!");
        console.log(result);
    } catch (error) {
        console.log("Error inserting the single document");
        console.log(error);
    }
}

const main = async () => {
    try {
        await connectToDatabe();
        await insertNewAccount();
    } catch (error) {
        console.log(`Error connecting to the DataBase ${dbName}`);
        console.log(error);
    } finally {
        await client.close();
    }
}

main();