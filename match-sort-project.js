const { MongoClient } = require("mongodb");
const uri = require("./atlas_uri");

const client = new MongoClient(uri);

const pipelines = [
    // Stage 1: Match - filters the documents
    {
        $match: {
            account_type: "checking",
            balance: { $gt: 1500 }
        }
    },

    // Stage 2: Sort - Sorting the documents decending order based on the balance
    {
        $sort: { balance: -1 }
    },

    // Step 3: Project - projects only the mentioned fields
    {
        $project: {
            _id: 0,
            account_id: 1,
            account_type: 1,
            balance: 1,
            // new field for projection
            gpb_balance: { $divide: ["$balance", 1.3] }
        }
    }
]

const main = async () => {
    try {
        await client.connect();
        console.log("Connect to the DB!");
        console.log(uri);

        const accounts = client.db("bank").collection("accounts");
        const result = await accounts.aggregate(pipelines);

        for await (const doc of result) {
            console.log(doc);
        }
    } catch (error) {
        console.error("Error connecting to the database: ", error);
    } finally {
        await client.close();
    }
}

main()