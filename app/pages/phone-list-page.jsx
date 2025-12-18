import PhoneModal from "../components/phone/phone-modal";
import Loader from "../components/skeleton/loader";
import PhoneList from "../components/phone/phone-list";

import { useQuery } from "@tanstack/react-query";
import {
  deletePhone,
  getAllPhone,
  getCurrentSession,
  getPhone,
} from "../api/phone";

import {
  Container,
  Typography,
  Paper,
  Fab,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function PhoneListPage() {
  const initialForm = { phone_number: "", country_code: "" };

  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [formErrors, setFormErrors] = useState({});
  const [selectedId, setSelectedId] = useState("");

  // Phone list
  const { error, data, isLoading } = useQuery({
    queryKey: ["phone"],
    queryFn: () => getAllPhone(),
  });

  const {
    error: detailError,
    data: getData,
    isLoading: detailLoading,
  } = useQuery({
    queryKey: ["getPhone", selectedId],
    queryFn: () => getPhone(selectedId),
    enabled: !!selectedId,
  });

  // Current Session
  const {
    error: sessionError,
    data: sessionData,
    isLoading: sessionLoading,
  } = useQuery({
    queryKey: ["shopify-current-session"],
    queryFn: () => getCurrentSession(),
  });

  const handleOpenModal = (phone) => {
    if (phone) {
      setEditMode(true);
      setSelectedId(phone._id);
    } else {
      setEditMode(false);
      setForm(initialForm);
      setSelectedId(null);
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setForm(initialForm);
    setSelectedId(null);
    setFormErrors({});
  };

  const handleDelete = async (row) => {
    try {
      const response = await deletePhone(row);
      if (response) {
        setSnackbar({
          open: true,
          message: response.message,
          severity: "success",
        });
        queryClient.invalidateQueries({ queryKey: ["phone"] });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to delete phone",
        severity: "error",
      });
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (getData?.data) {
      setForm({
        phone_number: getData?.data.phone_number,
        country_code: getData?.data.country_code,
      });
    }
  }, [getData]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" color="primary" fontWeight={700}>
            Phone List
          </Typography>
          <Fab
            color="primary"
            size="medium"
            aria-label="add"
            onClick={() => handleOpenModal()}
            sx={{ boxShadow: 2 }}
          >
            <Add />
          </Fab>
        </Box>

        {/* Phone List */}
        <PhoneList
          data={data?.data}
          handleOpenModal={handleOpenModal}
          handleDelete={handleDelete}
          message={data}
        />
      </Paper>

      {/* Phone Modal */}
      <PhoneModal
        modalOpen={modalOpen}
        editMode={editMode}
        form={form}
        formErrors={formErrors}
        setFormErrors={setFormErrors}
        handleCloseModal={handleCloseModal}
        handleChange={handleChange}
        sessionData={sessionData}
        setSnackbar={setSnackbar}
        selectedId={selectedId}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.severity === "error" ? 5000 : 3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
