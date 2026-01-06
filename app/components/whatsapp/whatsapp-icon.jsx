import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function WhatsAppIcon({
  phoneData,
  message = "",
  iconPosition = "right",
  buttonStyle = "icon_only",
  customIcon = "whatsapp",
  appEmbedEnabled = false,
}) {
  console.log("Phone", phoneData);
  if (!appEmbedEnabled || !phoneData?.length) return null;

  const fullNumber = phoneData.map((ele) => {
    return String(ele.country_code || "") + String(ele.phone_number || "")
      .replace(/(\+)(?=\d)/g, "")
      .replace(/\D/g, "");
  })[0];

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${fullNumber}/?text=${encodedMessage}`;

  const isIconWithText = buttonStyle === "icon_with_text";

  const getIconSrc = (icon) => {
    switch (icon) {
      case "chat1":
        return "/chat-icon-1.svg";
      case "chat2":
        return "/chat-icon-2.svg";
      case "chat3":
        return "/chat-icon-3.svg";
      default:
        return "/whatsapp.png";
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 30,
        [iconPosition]: 30,
        width: isIconWithText ? "auto" : 60,
        height: 60,
        zIndex: 9999,
        backgroundColor: "#25D366",
        borderRadius: isIconWithText ? "30px" : "50%",
        boxShadow: "0 4px 12px rgba(37, 211, 102, 0.3)",
        padding: isIconWithText ? "0px 20px" : "5px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.3s ease",
        textDecoration: "none",
        gap: isIconWithText ? "12px" : 0,
        "&:hover": {
          backgroundColor: "#128c7e",
          transform: "scale(1.05)",
          boxShadow: "0 6px 16px rgba(37, 211, 102, 0.4)",
        },
      }}
      component="a"
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      title="Chat with us on WhatsApp"
    >
      <img
        src={getIconSrc(customIcon)}
        alt="WhatsApp"
        style={{ width: "36px", height: "36px", objectFit: "contain" }}
      />
      {isIconWithText && (
        <Typography
          variant="body1"
          sx={{
            color: "white",
            fontWeight: 700,
            fontSize: "16px",
            whiteSpace: "nowrap",
            fontFamily: "inherit",
          }}
        >
          WhatsApp us
        </Typography>
      )}
    </Box>
  );
}