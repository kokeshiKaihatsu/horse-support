const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  const body = JSON.parse(event.body);

  console.log("Type:", body.type);

  // 支払い成功
  if (body.type === "invoice.paid") {
    const invoice = body.data.object;

    const line = invoice.lines.data[0];

    const email = invoice.customer_email;
    const customerId = invoice.customer;

    const subscriptionId =
      invoice.parent.subscription_details.subscription;

    const quantity = line.quantity;
    const amount = invoice.amount_paid;
    const invoiceId = invoice.id;

    // members更新
    const memberResult = await supabase
    .from("members")
    .upsert({
        email,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        quantity
    });

    console.log("MEMBER RESULT");
    console.log(JSON.stringify(memberResult, null, 2));

    const historyResult = await supabase
    .from("payment_history")
    .insert({
        email,
        amount,
        quantity,
        invoice_id: invoiceId
    });

console.log("HISTORY RESULT");
console.log(JSON.stringify(historyResult, null, 2));

console.log("Saved:", email);

    console.log("Saved:", email);
  }

  if (body.type === "customer.subscription.deleted") {
  const subscription = body.data.object;

  await supabase
    .from("members")
    .delete()
    .eq("stripe_subscription_id", subscription.id);
    }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true })
  };
};

