# Splitwise

## Prototype of Splitwise

This project is a prototype of the splitwise application.

## Steps to deploy the application

Root folder

1. Clone the entire respoitory and get into the root folder on machine that has nodejs installed on it and has access to Kafka servers.
2. On the terminal at the root folder, run "npm i" to install the root folder dependencies.

Frontend

1. Get into the frontend folder from the root folder.
2. Open terminal in the frontend folder and execute "npm i" to install all the frontend dependencies.
3. Locate the webConfig.js file in src folder and update the backend server's IP address and port number.

Kafka-backend

1. Get into the Kafka-backend folder from the root folder.
2. Open terminal in the Kafka-backend folder and execute "npm i" to install all the Kafka-backend dependencies.
3. Locate Connection.js file and update the Producer and consumer server's IP address and port number.
4. Open terminal in the Kafka-backend folder and execute "npm start".

Backend

1. Get into the Backend folder from the root folder.
2. Open terminal in the Backend folder and execute "npm i" to install all the backend dependencies.
3. Locate index.js file and update the frontend server's IP address and port number.
4. Locate connection.js file in Backend/kafka folder and update the Producer and consumer server's IP address and port number.
5. Update the config.js file in Backend/store with the mongoDB connection string and S3 details. ( poolSize is set to 500 and can be changed in Backend/index.js)
6. run "npm run dev" to run the application.

Open the browser and navigate to frontend server's IP address with port number to find the landing page of the application.
