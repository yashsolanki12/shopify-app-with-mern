import {
  TableContainer,
  TableHead,
  TableRow,
  Table,
  TableBody,
  TableCell,
  IconButton,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import NoPhonesCard from "./no-phone-found";
import MuiAlert from "@mui/material/Alert";
import { useEffect, useState, Suspense, lazy } from "react";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";

const ConfirmDialog = lazy(() => import("../ui/ConfirmDialog/confirm-dialog"));

export default function PhoneList(props) {
  const { data, handleOpenModal, handleDelete, message } = props;

  const [phoneListMessage, setPhoneListMessage] = useState({
    open: false,
    apiMessage: "",
    severity: "error",
  });

  const handleCloseSnackbar = () => {
    setPhoneListMessage({ ...phoneListMessage, open: false });
  };

  useEffect(() => {
    if (message && message?.success == false) {
      setPhoneListMessage({
        open: true,
        apiMessage: message.message,
        severity: "error",
      });
    }
  }, [message]);

  return (
    <TableContainer sx={{ maxHeight: 600, overflowY: "auto" }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#e3e6f0" }}>
            <TableCell sx={{ fontWeight: 600 }}>Country Code</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Phone Number</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <Suspense
          fallback={
            <TableRow>
              <TableCell colSpan={3} align="center">
                <CircularProgress size={20} />
              </TableCell>
            </TableRow>
          }
        >
          <TableBody>
            {data?.map((phone) => (
              <TableRow key={phone._id}>
                <TableCell>{phone.country_code}</TableCell>
                <TableCell>{phone.phone_number}</TableCell>
                <TableCell align="right" sx={{ display: "flex" }}>
                  <Suspense fallback={null}>
                    <ConfirmDialog
                      title="Confirm Phone Deletion"
                      description="Are you sure you want to delete this phone number? This action cannot be undone."
                      confirmText="Delete"
                      cancelText="Cancel"
                      onConfirm={() => handleDelete(phone._id)}
                    >
                      <IconButton color="error" size="small">
                        <Delete />
                      </IconButton>
                    </ConfirmDialog>
                  </Suspense>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenModal(phone)}
                    size="small"
                  >
                    <Edit />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <NoPhonesCard />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Suspense>
      </Table>

      {/* Snackbar for API messages */}
      <Snackbar
        open={phoneListMessage.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert severity={phoneListMessage.severity}>
          {phoneListMessage.apiMessage}
        </MuiAlert>
      </Snackbar>
    </TableContainer>
  );
}
