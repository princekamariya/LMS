import { Client, Environment, LogLevel } from "@paypal/paypal-server-sdk";

const client = new Client({
    clientCredentialsAuthCredentials: {
        oAuthClientId: process.env.PAYPAL_CLIENT_ID ?? "",
        oAuthClientSecret: process.env.PAYPAL_SECRET_ID ?? "",
    },
    timeout: 0,
    environment: Environment.Sandbox,
    logging: {
        logLevel: LogLevel.Info,
        logRequest: {
            logBody: true,
        },
        logResponse: {
            logHeaders: true,
        },
    },
});

export default client;
