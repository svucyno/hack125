# 🍃 Connecting Your Database

The local MongoDB server was not detected. To get your project fully running, you have two options:

## Option 1: MongoDB Atlas (Cloud - Highly Recommended 🚀)
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2.  Create a new Cluster (Free Shared tier is fine).
3.  Go to **Database Access** -> Add User (Create a username/password).
4.  Go to **Network Access** -> Add IP -> Allow access from anywhere.
5.  Go to **Deployment** -> **Connect** -> **Drivers** -> Copy the `mongodb+srv://...` link.
6.  Open `server/.env` and replace `MONGO_URI` with your link:
    ```env
    MONGO_URI=mongodb+srv://<db_username>:<db_password>@cluster0.abcde.mongodb.net/mediconnect
    ```

## Option 2: Local MongoDB
1.  Download and install [MongoDB Community Edition](https://www.mongodb.com/try/download/community).
2.  Start the `mongod` service on your Windows machine.
3.  The project will automatically connect to `mongodb://localhost:27017/mediconnect`.

---
**Note:** The application will still start and the AI components will work without a database, but saving records and user logins require one of these options.
