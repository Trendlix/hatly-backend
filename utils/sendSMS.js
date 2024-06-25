const axios = require("axios");
const twilio = require('twilio');

const sendSMS = async (phone ,message) => {
  const client = new twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN)
  try {
    // const res = await axios.post(
    //   `${process.env.SMS_URL}?username=${process.env.SMS_USERNAME}&password=${process.env.SMS_PASSWORD}&sender=${process.env.SMS_SENDER}&environment=1&language=1&mobile=${phone}&message=${message}`,
    // );
    await client.messages.create({
      body: message,
      from: process.env.PHONE_NUMBER,
      to: `+2${phone}`,
    }).then((response) => {
      console.log('message is sent to client phone');
    }).catch((error)=>{
      console.log('error sending message to client phone');
      console.log(error);
    })
  } catch (error) {
    console.log(error);
  }
}

module.exports = sendSMS;