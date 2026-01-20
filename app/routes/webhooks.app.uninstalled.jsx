import { authenticate } from "../shopify.server";
import db from "../db.server";
import axios from "axios";

export const action = async ({ request }) => {
  const { shop, session } = await authenticate.webhook(request);

  // Webhook requests can trigger multiple times and after an app has already been uninstalled.
  // If this webhook already ran, the session may have been deleted previously.
  if (session) {
    await db.session.deleteMany({ where: { shop } });
  }

  // Always call backend to ensure session and related data are deleted
  if (shop) {
    try {
      await axios.post(
        "https://whatsapp-mern-backend-sidn.onrender.com/api/phone/uninstall-cleanup",
        { shop },
        { headers: { "x-api-key": process.env.BACKEND_API_KEY || "" } },
      );
    } catch (err) {
      // Log but do not throw, as webhook must return 200
      console.error("Failed to cleanup backend session for shop", shop, err);
    }
  }

  return new Response();
};
