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
};

// Collections
const accounts = client.db("bank").collection("accounts")
const transfers = client.db("bank").collection("transfers")

// Account information
const account_id_sender = "123456"
const account_id_receiver = "654321"
const transaction_amount = 150000


const session = client.startSession();



const main = async () => {
    try {
        await connectToDatabe();
        const transactionResults = await session.withTransaction(async () => {

            // Step 1: Update sender balance
            const senderUpdate = await accounts.updateOne(
                { account_id: account_id_sender },
                { $inc: { balance: -transaction_amount } },
                session
            );

            console.log(`${senderUpdate.matchedCount} documents(s) matched the filter and updated ${senderUpdate.modifiedCount} documents for the sender account`);

            // Step 2: Update receiver balance

            const receiverUpdate = await accounts.updateOne(
                { account_id: account_id_receiver },
                { $inc: { balance: transaction_amount } },
                session
            );

            console.log(`${receiverUpdate.matchedCount} documents(s) matched the filter and updated ${receiverUpdate.modifiedCount} documents for the receiver account`);


            // Step 3: Insert the transfer document
            const transferDocument = {
                transfer_id: "TR21872187",
                amount: transaction_amount,
                from_account: account_id_sender,
                to_account: account_id_receiver
            };

            const insertTranferResult = await transfers.insertOne(transferDocument, { session });
            console.log(`Successfully inserted ${insertTranferResult.insertedId} into the transfer collection`);

            // Step 4: Update the transfer_complete field for the sender account 
            const updateSenderTransferResults = await accounts.updateOne(
                { account_id: account_id_sender },
                { $push: { transfers_complete: transferDocument.transfer_id } },
                { session }
            );
            console.log(`${updateSenderTransferResults.matchedCount} documents(s) matched the in the transfer collection and updated ${updateSenderTransferResults.modifiedCount} documents for the sender account`);

            // Step 5: Update the transfer_complete field for the sender account 
            const updateReceiverTransferResults = await accounts.updateOne(
                { account_id: account_id_receiver },
                { $push: { transfers_complete: transferDocument.transfer_id } },
                { session }
            );
            console.log(`${updateReceiverTransferResults.matchedCount} documents(s) matched the in the transfer collection and updated ${updateReceiverTransferResults.modifiedCount} documents for the receiver account`);

        });

        console.log("Committing transaction ...");

        if (transactionResults) {
            console.log("Transaction completed successfully.")
        } else {
            console.log("Transaction Abort.")
        }


    } catch (error) {
        console.log(`Transaction Aborted: ${error}`);
    } finally {
        await session.endSession();
        await client.close();
    }
};

main();