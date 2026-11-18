exports.handler = async (event) => {
  console.log("Stripe Webhook Received");
  console.log(event.body);

  return {
    statusCode: 200,
    body: JSON.stringify({
      received: true
    })
  };
};