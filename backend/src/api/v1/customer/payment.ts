import { Router } from "express";
import Stripe from "stripe";
import { db } from "../../../../db/db";
import { UserRequest } from "../../../types/types";
import { verifyUser } from "../../../middleware/verifyUser";
import { RowDataPacket } from "mysql2";

const payment = Router();

payment.use(verifyUser);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  // Function to fetch payment methods and send response
  async function fetchPaymentMethods(customerId: string, res: any) {
    try {
      // Fetch the customer's payment methods
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: "card",
      });
  
      // Fetch the customer's details and assert the type
      const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer & {
        invoice_settings: { default_payment_method: string | null };
      };
  
      const defaultPaymentMethodId = customer.invoice_settings.default_payment_method;
  
      // Prepare the response data including default status
      let data = paymentMethods.data.map((method) => ({
        id: method.id,
        brand: method.card?.brand,
        last4: method.card?.last4,
        isDefault: method.id === defaultPaymentMethodId, // Check if this method is the default one
      }));
  
      res.status(200).json(data);
    } catch (error) {
      console.error("Stripe API error:", error);
      return res.status(500).send("Failed to retrieve payment methods.");
    }
  }
    // Function to create and attach payment method and set it as default
    async function createAndAttachPaymentMethod(customerId: string, token: string, res: any) {
        try {
          // Create a new payment method with the provided token
          const paymentMethod = await stripe.paymentMethods.create({
            type: "card",
            card: {
              token: token,
            },
          });
      
          // Attach the newly created payment method to the customer
          await stripe.paymentMethods.attach(paymentMethod.id, {
            customer: customerId,
          });
      
          // Update the customer's default payment method to the newly attached payment method
          await stripe.customers.update(customerId, {
            invoice_settings: {
              default_payment_method: paymentMethod.id, // Set the newly added payment method as the default
            },
          });
      
          res.status(200).send({ message: "Payment method added and set as default successfully" });
        } catch (error) {
          console.error(error);
          return res.status(500).send("Internal Server Error");
        }
      }

  // Function to fetch billing history from Stripe
  async function fetchBillingHistory(customerId: string, res: any) {
    try {
      // Fetch the user's billing history (invoices) from Stripe
      const invoices = await stripe.invoices.list({
        customer: customerId,
        limit: 10, // Adjust the limit as needed
      });
  
      // Extract the relevant details from each invoice
      const formattedInvoices = await Promise.all(
        invoices.data.map(async (invoice) => {
          const description = invoice.lines.data[0]?.description || "No description";
          const amount = (invoice.amount_paid / 100).toFixed(2) + " " + invoice.currency.toUpperCase();
          const date = new Date(invoice.created * 1000).toLocaleDateString();
  
          // Fetch the charge details to get the last 4 digits of the card
          let last4 = "N/A";
          if (invoice.charge) {
            const charge = await stripe.charges.retrieve(invoice.charge as string);
            last4 = charge.payment_method_details?.card?.last4 || "N/A";
          }
  
          // Fetch the subscription details to check for auto-renewal, get start/end dates, and calculate duration in months
          let autoRenewal = false;
          let subscriptionStart = "N/A";
          let subscriptionEnd = "N/A";
          let subscriptionDurationInMonths = "N/A";
  
          if (invoice.subscription) {
            const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
            autoRenewal = subscription.cancel_at_period_end === false;
  
            // Convert the start and end dates from Unix timestamps to readable dates
            subscriptionStart = new Date(subscription.current_period_start * 1000).toLocaleDateString();
            subscriptionEnd = new Date(subscription.current_period_end * 1000).toLocaleDateString();
  
            // Calculate the subscription duration in months
            const startDate = new Date(subscription.current_period_start * 1000);
            const endDate = new Date(subscription.current_period_end * 1000);
            const durationInMonths =
              (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
            subscriptionDurationInMonths = `${durationInMonths} months`;
          }
  
          return {
            description,
            amount,
            date,
            last4,
            autoRenewal: autoRenewal ? "Auto-renewal" : "Not auto-renewal",
            subscriptionStart,
            subscriptionEnd,
            subscriptionDurationInMonths,
          };
        })
      );
  
      // Send the formatted invoices data back in the response
      res.status(200).json({
        message: "Billing history retrieved successfully",
        data: formattedInvoices,
      });
    } catch (error) {
      console.error("Error fetching billing history:", error);
      return res.status(500).send("Internal Server Error");
    }
  }
  
  payment.post("/create-payment-method", async (req: UserRequest, res) => {
    const paymentMethodId = req.body.paymentMethodId;
    const { token } = req.body;
  
    db.query<RowDataPacket[]>(
      "SELECT stripe_id FROM users WHERE id = ?",
      [req.userId],
      async (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Internal Server Error");
        }
  
        if (result.length === 0) {
          return res.status(404).send("User not found");
        }
  
        let customerId = result[0].stripe_id;
  
        try {
          // If stripe_id is not present or is empty, retrieve the phone number and create a new Stripe customer
          if (!customerId || customerId.trim() === "") {
            // Fetch phone number from user_profiles table
            db.query<RowDataPacket[]>(
              "SELECT phone FROM user_profiles WHERE user_id = ?",
              [req.userId],
              async (profileErr, profileResult) => {
                if (profileErr) {
                  console.error("Database error while fetching phone:", profileErr);
                  return res.status(500).send("Internal Server Error");
                }
  
                if (profileResult.length === 0) {
                  return res.status(404).send("User profile not found");
                }
  
                const userPhone = profileResult[0].phone;
  
                if (!userPhone) {
                  console.error("No phone number associated with user:", req.userId);
                  return res.status(400).send("No phone number associated with this user.");
                }
  
                // Create a new Stripe customer using the phone number
                const newCustomer = await stripe.customers.create({
                  phone: userPhone,
                });
  
                customerId = newCustomer.id;
  
                // Update your database with the new Stripe customer ID
                db.query(
                  "UPDATE users SET stripe_id = ? WHERE id = ?",
                  [customerId, req.userId],
                  (updateErr) => {
                    if (updateErr) {
                      console.error("Failed to update Stripe customer ID in database:", updateErr);
                      return res.status(500).send("Internal Server Error");
                    }
                  }
                );
  
                // Continue to create and attach the payment method
                await createAndAttachPaymentMethod(customerId, token, res);
              }
            );
          } else {
            // If stripe_id exists, directly create and attach the payment method
            await createAndAttachPaymentMethod(customerId, token, res);
          }
        } catch (error) {
          console.error("Stripe API error:", error);
          return res.status(500).send("Failed to create Stripe customer.");
        }
      }
    );
  });
  

payment.post("/create-subscription", async (req: UserRequest, res) => {
    const priceId = req.body.priceId;

    db.query<RowDataPacket[]>("SELECT stripe_id FROM users WHERE id = ?", [req.userId], async (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Internal Server Error");
        }

        if (result.length === 0) {
            return res.status(404).send("User not found");
        }

        const customerId = result[0].stripe_id;

        const paymentMethods = await stripe.paymentMethods.list({
            customer: customerId,
            type: "card",
        });

        if (paymentMethods.data.length === 0) {
            res.status(200).json({ message: "No payment method found", url: "/addpaymentmethod?type=subscribe" });
            return;
        }

        try {
            await stripe.customers.update(customerId, {
                email: req.user.email,
            });
            await stripe.subscriptions.create({
                customer: customerId,
                items: [{ price: priceId }],
                default_payment_method: paymentMethods.data[0].id,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send("Internal Server Error");
        }

        res.status(200).send({ message: "Subscription created successfully" });
    });
});

payment.post("/create-subscription/:coupon", async (req: UserRequest, res) => {
    const priceId = req.body.priceId;
    const coupon = req.params.coupon;
    const productId = req.body.product;

    const [result] = await db.promise().query<RowDataPacket[]>("SELECT id, applies_to, once_per_user FROM promotional_codes WHERE stripe_id = ?", [coupon]);

    const promoId = result[0].id;

    if (result.length === 0) {
        return res.status(404).json({ message: "Invalid Coupon Code" });
    }

    if (result[0].applies_to !== productId) {
        console.log(result[0].applies_to, productId);
        return res.status(404).json({ message: "This coupon is not applicable for the selected product" });
    }

    if (result[0].once_per_user) {
        const [usage] = await db.promise().query<RowDataPacket[]>("SELECT id FROM promotional_codes_usages WHERE promotional_codes_id = ? AND user_id = ?", [result[0].id, req.userId]);

        if (usage.length > 0) {
            return res.status(404).json({ message: "Coupon can only be used once per user" });
        }
    }

    db.query<RowDataPacket[]>("SELECT stripe_id FROM users WHERE id = ?", [req.userId], async (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Internal Server Error");
        }

        if (result.length === 0) {
            return res.status(404).send("User not found");
        }

        const customerId = result[0].stripe_id;

        const paymentMethods = await stripe.paymentMethods.list({
            customer: customerId,
            type: "card",
        });

        if (paymentMethods.data.length === 0) {
            res.status(200).json({ message: "No payment method found", url: "/addpaymentmethod?type=subscribe" });
            return;
        }

        try {
            await stripe.customers.update(customerId, {
                email: req.user.email,
            });
            await stripe.subscriptions.create({
                customer: customerId,
                items: [{ price: priceId }],
                default_payment_method: paymentMethods.data[0].id,
                discounts: [
                    {
                        coupon: coupon,
                    }
                ]
            });
            await db.promise().query("INSERT INTO promotional_codes_usages (promotional_codes_id, user_id, created_at, updated_at) VALUES (?, ?, NOW(), NOW())", [promoId, req.userId]);
        } catch (error) {
            console.log(error);
            return res.status(500).send("Internal Server Error");
        }

        res.status(200).send({ message: "Subscription created successfully" });
    });
});

payment.get("/methods", async (req: UserRequest, res) => {
    db.query<RowDataPacket[]>(
      "SELECT stripe_id FROM users WHERE id = ?",
      [req.userId],
      async (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).send("Internal Server Error");
        }
  
        if (result.length === 0) {
          return res.status(404).send("User not found");
        }
  
        let customerId = result[0].stripe_id;
  
        try {
          // If stripe_id is not present or is empty, retrieve the phone number and create a new Stripe customer
          if (!customerId || customerId.trim() === "") {
            // Fetch phone number from user_profiles table
            db.query<RowDataPacket[]>(
              "SELECT phone FROM user_profiles WHERE user_id = ?",
              [req.userId],
              async (profileErr, profileResult) => {
                if (profileErr) {
                  console.error("Database error while fetching phone:", profileErr);
                  return res.status(500).send("Internal Server Error");
                }
  
                if (profileResult.length === 0) {
                  return res.status(404).send("User profile not found");
                }
  
                const userPhone = profileResult[0].phone;
  
                if (!userPhone) {
                  console.error("No phone number associated with user:", req.userId);
                  return res.status(400).send("No phone number associated with this user.");
                }
  
                // Create a new Stripe customer using the phone number
                const newCustomer = await stripe.customers.create({
                  phone: userPhone,
                });
  
                customerId = newCustomer.id;
  
                // Update your database with the new Stripe customer ID
                db.query(
                  "UPDATE users SET stripe_id = ? WHERE id = ?",
                  [customerId, req.userId],
                  (updateErr) => {
                    if (updateErr) {
                      console.error("Failed to update Stripe customer ID in database:", updateErr);
                      return res.status(500).send("Internal Server Error");
                    }
                  }
                );
  
                // Continue to fetch payment methods after creating the new customer
                fetchPaymentMethods(customerId, res);
              }
            );
          } else {
            // If stripe_id exists, directly fetch the payment methods
            fetchPaymentMethods(customerId, res);
          }
        } catch (error) {
          console.error("Stripe API error:", error);
          return res.status(500).send("Failed to create Stripe customer.");
        }
      }
    );
  });

payment.delete("/methods/:id", async (req: UserRequest, res) => {
    const paymentMethodId = req.params.id;

    // Retrieve the Stripe customer ID from the database
    db.query<RowDataPacket[]>("SELECT stripe_id FROM users WHERE id = ?", [req.userId], async (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }

        if (result.length === 0) {
            return res.status(404).send("User not found");
        }

        const customerId = result[0].stripe_id;

        try {
            // Detach the payment method from the customer
            const paymentMethod = await stripe.paymentMethods.detach(paymentMethodId);

            if (paymentMethod.customer === null) {
                res.status(200).send("Payment method deleted successfully");
            } else {
                res.status(400).send("Failed to delete payment method");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).send("Internal Server Error");
        }
    });
});

payment.post("/methods/default", async (req: UserRequest, res) => {
    const { paymentMethodId } = req.body; // Get the payment method ID from the request body

    db.query<RowDataPacket[]>("SELECT stripe_id FROM users WHERE id = ?", [req.userId], async (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Internal Server Error");
        }

        if (result.length === 0) {
            return res.status(404).send("User not found");
        }

        const customerId = result[0].stripe_id;

        try {
            // Attach the payment method to the customer if it's not already attached
            await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });

            // Set the payment method as the default for the invoice and the customer
            await stripe.customers.update(customerId, {
                invoice_settings: {
                    default_payment_method: paymentMethodId,
                }
            });

            res.status(200).send("Default payment method updated successfully");
        } catch (error) {
            console.log(error);
            return res.status(500).send("Internal Server Error");
        }
    });
});

payment.get("/check-valid-coupon/:product/:coupon", async (req: UserRequest, res) => {
    try {
        const [result] = await db.promise().query<RowDataPacket[]>("SELECT applies_to FROM promotional_codes WHERE stripe_id = ?", [req.params.coupon]);

        if (result.length === 0) {
            return res.status(200).json({ valid: false });
        }

        if (result[0].applies_to !== req.params.product) {
            return res.status(200).json({ valid: false, message: "This coupon is not applicable for the selected product" });
        }

        const coupon = await stripe.coupons.retrieve(req.params.coupon);

        if (coupon.valid) {
            res.status(200).send({
                valid: true,
                percentOff: coupon.percent_off,
                amountOff: coupon.amount_off,
                products: coupon.applies_to?.products,
            });
        } else {
            res.status(200).send({ valid: false });
        }
    } catch (error) {
        console.log(error);
        res.status(200).json({ valid: false });
    }
});

payment.get("/billing-history", async (req: UserRequest, res) => {
    // Retrieve the user's Stripe customer ID from your database
    db.query<RowDataPacket[]>(
      "SELECT stripe_id FROM users WHERE id = ?",
      [req.userId],
      async (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Internal Server Error");
        }
  
        if (result.length === 0) {
          return res.status(404).send("User not found");
        }
  
        let customerId = result[0].stripe_id;
  
        try {
          // If stripe_id is not present or is empty, retrieve the phone number and create a new Stripe customer
          if (!customerId || customerId.trim() === "") {
            // Fetch phone number from user_profiles table
            db.query<RowDataPacket[]>(
              "SELECT phone FROM user_profiles WHERE user_id = ?",
              [req.userId],
              async (profileErr, profileResult) => {
                if (profileErr) {
                  console.error("Database error while fetching phone:", profileErr);
                  return res.status(500).send("Internal Server Error");
                }
  
                if (profileResult.length === 0) {
                  return res.status(404).send("User profile not found");
                }
  
                const userPhone = profileResult[0].phone;
  
                if (!userPhone) {
                  console.error("No phone number associated with user:", req.userId);
                  return res.status(400).send("No phone number associated with this user.");
                }
  
                // Create a new Stripe customer using the phone number
                const newCustomer = await stripe.customers.create({
                  phone: userPhone,
                });
  
                customerId = newCustomer.id;
  
                // Update your database with the new Stripe customer ID
                db.query(
                  "UPDATE users SET stripe_id = ? WHERE id = ?",
                  [customerId, req.userId],
                  (updateErr) => {
                    if (updateErr) {
                      console.error("Failed to update Stripe customer ID in database:", updateErr);
                      return res.status(500).send("Internal Server Error");
                    }
                  }
                );
  
                // Continue to fetch billing history
                await fetchBillingHistory(customerId, res);
              }
            );
          } else {
            // If stripe_id exists, directly fetch billing history
            await fetchBillingHistory(customerId, res);
          }
        } catch (error) {
          console.error("Stripe API error:", error);
          return res.status(500).send("Failed to create Stripe customer.");
        }
      }
    );
  });






export default payment;