import * as restify from 'restify';
import * as builder from 'botbuilder';

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`${server.name} listening to ${server.url}`);
});

// Create chat bot
let connector = new builder.ConsoleConnector().listen();
let bot = new builder.UniversalBot(connector);

// Create LUIS recognizer that points at our model and add it as the root '/' dialog for our Cortana Bot.
let url = 'LUIS_URL';
let recognizer = new builder.LuisRecognizer(url);
let intents = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', intents);

//=========================================================
// Bots Dialogs
//=========================================================
// Add intent handlers
intents.matches('orderBeer', [
    (session, args, next) => {
        // Resolve and store any entities passed from LUIS.
        let brand = builder.EntityRecognizer.findEntity(args.entities, 'brand');
        let size = builder.EntityRecognizer.findEntity(args.entities, 'size');
        session.send(`Vous avez commandé une ${brand.entity} en ${size.entity}. Elle est en cours de préparation !`);
    }
]);

intents.matches('None', [
    (session, args, next) => {
        session.send(`Je n'ai pas compris votre demande`);
    }
]);


