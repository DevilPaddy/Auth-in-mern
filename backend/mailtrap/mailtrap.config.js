const { MailtrapClient } = require("mailtrap");
require("dotenv").config();

const TOKEN = '2767f14a88fecf3e4e4b09f6d283ede4';

const client = new MailtrapClient({
  token: TOKEN,
});

const sender = {
  email: "hello@demomailtrap.com",
  name: "Mailtrap Test",
};

module.exports = {client, TOKEN, sender};