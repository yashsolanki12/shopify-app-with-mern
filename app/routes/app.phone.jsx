import { Suspense, lazy } from "react";
import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";

const PhoneListPage = lazy(() => import("../pages/phone-list-page"));

export const loader = async ({ request }) => {
  // ... keep loader logic
  console.log("Debug: app.phone.jsx loader started");
  const { admin, session } = await authenticate.admin(request);

  try {
    // 1. Fetch main theme using raw fetch
    const themesResponse = await fetch(
      `https://${session.shop}/admin/api/2026-01/themes.json?role=main`,
      {
        headers: {
          "X-Shopify-Access-Token": session.accessToken,
          "Content-Type": "application/json",
        },
      }
    );

    if (!themesResponse.ok) {
      const errorText = await themesResponse.text();
      return { appEmbedEnabled: false, debugMessage: `Theme fetch failed: ${themesResponse.status} ${errorText}` };
    }

    const themesData = await themesResponse.json();

    if (!themesData.themes || themesData.themes.length === 0) {
      return { appEmbedEnabled: false, debugMessage: "No main theme found in themes list" };
    }

    const mainTheme = themesData.themes[0];

    // 2. Fetch settings_data.json
    const assetsResponse = await fetch(
      `https://${session.shop}/admin/api/2026-01/themes/${mainTheme.id}/assets.json?asset[key]=config/settings_data.json`,
      {
        headers: {
          "X-Shopify-Access-Token": session.accessToken,
          "Content-Type": "application/json",
        },
      }
    );

    if (!assetsResponse.ok) {
      const errorText = await assetsResponse.text();
      return { appEmbedEnabled: false, debugMessage: `Asset fetch failed: ${assetsResponse.status} ${errorText}` };
    }

    const assetData = await assetsResponse.json();
    const asset = assetData.asset;

    if (!asset || !asset.value) {
      return { appEmbedEnabled: false, debugMessage: "settings_data.json asset or value is missing" };
    }

    const settingsJson = asset.value;
    const settingsData = JSON.parse(settingsJson);

    if (settingsData.current && settingsData.current.blocks) {
      // Filter for all blocks that match the whatsapp-mern type
      const whatsappBlocks = Object.keys(settingsData.current.blocks)
        .filter(key => {
          const block = settingsData.current.blocks[key];
          return block.type && block.type.includes("whatsapp-mern");
        })
        .map(key => settingsData.current.blocks[key]);

      console.log(`Debug: Found ${whatsappBlocks.length} whatsapp-mern blocks`);

      if (whatsappBlocks.length > 0) {
        // Check if ANY of the blocks are enabled (both App Embed toggle AND inner settings)
        const isAnyEnabled = whatsappBlocks.some(block => {
          const isAppEmbedOn = !block.disabled;
          // Inner setting 'enabled' defaults to true if missing
          const isInnerSettingOn = block.settings.enabled !== false;
          return isAppEmbedOn && isInnerSettingOn;
        });

        const firstBlock = whatsappBlocks[0];
        const settings = firstBlock.settings || {};

        return {
          appEmbedEnabled: isAnyEnabled,
          debugMessage: `Found blocks. Decision: ${isAnyEnabled}`,
          initialSettings: {
            message: settings.default_message || "",
            position: settings.icon_position || "right"
          },
          apiKey: process.env.SHOPIFY_API_KEY,
          foundBlockType: firstBlock.type
        };
      } else {
        return { appEmbedEnabled: false, debugMessage: "No whatsapp-mern blocks found in settings", apiKey: process.env.SHOPIFY_API_KEY };
      }
    }
    return { appEmbedEnabled: false, debugMessage: "settingsData.current.blocks is missing", apiKey: process.env.SHOPIFY_API_KEY };

  } catch (error) {
    console.error("Error fetching theme settings:", error);
    return { appEmbedEnabled: false, debugMessage: `Exception caught: ${error.message}`, apiKey: process.env.SHOPIFY_API_KEY };
  }
};

export default function PhonePage() {
  const data = useLoaderData();
  const appEmbedEnabled = data?.appEmbedEnabled ?? false;

  return (
    <Suspense fallback={""}>
      <PhoneListPage
        appEmbedEnabled={appEmbedEnabled}
        initialSettings={data?.initialSettings}
        apiKey={data?.apiKey}
        session={data?.session}
        foundBlockType={data?.foundBlockType}
      />
    </Suspense>
  );
}
