'use strict';

let Wit = null;
let interactive = null;
try {
  // if running from repo
  Wit = require('../').Wit;
  interactive = require('../').interactive;
} catch (e) {
  Wit = require('node-wit').Wit;
  interactive = require('node-wit').interactive;
}

const accessToken = (() => {
  if (process.argv.length !== 3) {
    console.log('usage: node app.js <wit-access-token>');
    process.exit(1);
  }
  return process.argv[2];
})();

// Quickstart example
// See https://wit.ai/ar7hur/quickstart

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value
  ;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

const actions = {
  send(request, response) {
    const {sessionId, context, entities} = request;
    const {text, quickreplies} = response;
    //console.log('sending...', JSON.stringify(response));
    console.log(response.text);
  },
  getPrerequisite({context, entities}) {
    var bet = firstEntityValue(entities, 'bet');
    if (bet) {
        let reply = null;
        switch (bet.toString().toLowerCase()) {
            case "single":
                reply = "You need to place 1 selection and win it.";
            break;           
            case "double":
                reply = "You need to place 2 selections in different events and all of them win.";
            break;
            case "treble":
                reply = "You need to place 3 selections in different events and all of them win.";
            break;
            case "4-fold accumulator":
                reply = "You need to place 4 selections in different events and all of them win.";
            break;
        }
      context.requirements = "\n" + reply; // we should call a weather API here
      delete context.missingPrerequisite;
    } else {
      context.missingPrerequisite = true;
      delete context.requirements;
    }
    return context;
  },
  getRecommendedBets({context, entities}) {
    var yesno = firstEntityValue(entities, 'yes_no');    
    let reply = null;
    switch (yesno.toString().toLowerCase()) {
      case "yes":
        reply = "Aintree 9:15\n";
        reply+= "Aintree 9:30\n";
        reply+= "Aintree 12:00\n";
        reply+= "Aintree 17:10\n";
        break;
      case "no":
        break;
    }
    context.randomBetRecommends = "\n" + reply;
    return context;
  }
};

const client = new Wit({accessToken, actions});
interactive(client);
