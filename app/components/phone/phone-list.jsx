import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import PropTypes from "prop-types";
import NoPhonesCard from "./no-phone-found";
import MuiAlert from "@mui/material/Alert";
import React from "react";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";

import ConfirmDialog from "../ui/ConfirmDialog/confirm-dialog";

export default function PhoneList(props) {
  const { data, handleOpenModal, handleDelete, message } = props;

  const [phoneListMessage, setPhoneListMessage] = React.useState({
    open: false,
    apiMessage: "",
    severity: "error",
  });

  const handleCloseSnackbar = () => {
    setPhoneListMessage({ ...phoneListMessage, open: false });
  };

  React.useEffect(() => {
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

        <TableBody>
          <React.Suspense
            fallback={
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <CircularProgress size={20} />
                </TableCell>
              </TableRow>
            }
          >
            {data?.map((phone) => (
              <TableRow key={phone._id}>
                <TableCell>{phone.country_code}</TableCell>
                <TableCell>{phone.phone_number}</TableCell>
                <TableCell align="right" sx={{ display: "flex" }}>
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
          </React.Suspense>
        </TableBody>
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

PhoneList.propTypes = {
  data: PropTypes.array,
  handleOpenModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  message: PropTypes.object,
};
