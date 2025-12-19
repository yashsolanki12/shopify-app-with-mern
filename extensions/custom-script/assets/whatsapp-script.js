// WhatsApp logo injection for app embed
function initWhatsAppButton() {
  // Only run on frontend, not in theme editor
  if (window.Shopify && window.Shopify.designMode === true) return;

  // Create and inject styles
  if (!document.getElementById("whatsapp-logo-css")) {
    const style = document.createElement("style");
    style.id = "whatsapp-logo-css";
    style.textContent = `
      .whatsapp-embed-logo {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 60px;
        height: 60px;
        z-index: 9999;
        background: #25D366;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        padding: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .whatsapp-embed-logo:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 16px rgba(0,0,0,0.25);
      }
      .whatsapp-embed-logo img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    `;
    document.head.appendChild(style);
  }

  // Create and inject button if it doesn't exist
  if (!document.getElementById("whatsapp-embed-logo")) {
    const whatsappLogo = document.createElement("a");
    whatsappLogo.href = "https://wa.me/";
    whatsappLogo.target = "_blank";
    whatsappLogo.rel = "noopener noreferrer";
    whatsappLogo.id = "whatsapp-embed-logo";
    whatsappLogo.className = "whatsapp-embed-logo";
    whatsappLogo.title = "Chat with us on WhatsApp";

    const img = document.createElement("img");
    img.src =
      "/extension/custom-script/assets/whatsapp.png";
    img.alt = "WhatsApp";
    img.loading = "lazy";

    whatsappLogo.appendChild(img);
    document.body.appendChild(whatsappLogo);
  }
}

// Initialize when DOM is fully loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initWhatsAppButton);
} else {
  initWhatsAppButton();
}

