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

  // Create and inject button and textarea if they don't exist
  if (!document.getElementById("whatsapp-embed-logo")) {
    const whatsappLogo = document.createElement("a");
    whatsappLogo.href = "https://wa.me/";
    whatsappLogo.target = "_blank";
    whatsappLogo.rel = "noopener noreferrer";
    whatsappLogo.id = "whatsapp-embed-logo";
    whatsappLogo.className = "whatsapp-embed-logo";
    whatsappLogo.title = "Chat with us on WhatsApp";

    const img = document.createElement("img");
    img.src = "/extension/custom-script/assets/whatsapp.png";
    img.alt = "WhatsApp";
    img.height = "60",
    img.width = "60";
    img.loading = "lazy";
    whatsappLogo.appendChild(img);

    // Add textarea for message input (max 50 chars)
    const textarea = document.createElement("textarea");
    textarea.id = "whatsapp-message";
    textarea.maxLength = 50;
    textarea.rows = 2;
    textarea.placeholder = "Type your message";
    textarea.style.marginTop = "10px";
    textarea.style.resize = "none";
    textarea.style.width = "100%";
    textarea.style.position = "fixed";
    textarea.style.bottom = "100px";
    textarea.style.right = "30px";
    textarea.style.zIndex = 9999;
    // Set initial value from data attribute if present
    const defaultMsg = document.body.getAttribute(
      "data-whatsapp-default-message",
    );
    if (defaultMsg) textarea.value = defaultMsg;

    document.body.appendChild(whatsappLogo);
    document.body.appendChild(textarea);

    // Update WhatsApp link with textarea value on click
    whatsappLogo.addEventListener("click", function (e) {
      e.preventDefault();
      const msg = textarea.value.trim();
      // Use a default/test phone number if not set
      let phone = whatsappLogo.getAttribute("data-phone");
      if (!phone || phone === "") {
        phone = "91 8128587898"; // <-- Set your default/test phone number here
      }
      let waUrl = "https://wa.me/" + phone;
      if (msg.length > 0) {
        waUrl += `?text=${encodeURIComponent(msg)}`;
      }
      whatsappLogo.href = waUrl;
    });
  }
}

// Initialize when DOM is fully loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initWhatsAppButton);
} else {
  initWhatsAppButton();
}
