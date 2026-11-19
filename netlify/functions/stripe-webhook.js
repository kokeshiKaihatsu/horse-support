exports.handler = async (event) => {
  const body = JSON.parse(event.body);

  console.log("=== Stripe Event ===");
  console.log("Type:", body.type);

  if (body.data?.object) {
    console.log("Data:", JSON.stringify(body.data.object, null, 2));
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true })
  };
};