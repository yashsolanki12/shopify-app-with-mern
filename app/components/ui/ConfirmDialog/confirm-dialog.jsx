import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const ConfirmDialog = ({
  children,
  title = "Are you sure?",
  description = "This action cannot be revert",
  onConfirm,
  confirmText = "Yes",
  cancelText = "No",
}) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    try {
      onConfirm();
    } finally {
      setOpen(false);
    }
  };

  return (
    <div style={{ pointerEvents: "auto" }}>
      {React.isValidElement(children) ? (
        React.cloneElement(children, {
          type: "button",
          onClick: (event) => {
            const existing = children.props?.onClick;
            if (typeof existing === "function") existing(event);
            handleClickOpen();
          },
        })
      ) : (
        <Button type="button" onClick={handleClickOpen}>
          {children}
        </Button>
      )}
      <Dialog
        open={open}
        // onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onClose={(reason) => {
          // Only allow closing via Cancel button, not outside click or escape
          if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return;
          }
        }}
      >
        <DialogTitle id="alert-dialog-title" variant="h6">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" variant="subtitle1">
            {description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            {cancelText}
          </Button>
          <Button
            color="error"
            onClick={handleConfirm}
            variant="contained"
            autoFocus
          >
            {confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default ConfirmDialog;
