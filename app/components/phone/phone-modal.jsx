import CircularProgress from "@mui/material/CircularProgress";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { phoneSchema } from "../../validation/phone.schema";
import { createPhone, editPhone } from "../../api/phone";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function PhoneModal(props) {
  const {
    modalOpen,
    editMode,
    form,
    formErrors,
    setFormErrors,
    handleCloseModal,
    handleChange,
    sessionData,
    setSnackbar,
    selectedId,
  } = props;

  const [sessionId, setSessionId] = useState(null);
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    try {
      const createPayload = {
        ...form,
        ...(sessionId && { shopify_session_id: sessionId }),
      };
      const editPayload = {
        ...form,
      };
      const payload = editMode ? editPayload : createPayload;

      // Zod validation
      const result = phoneSchema.safeParse(form);
      if (!result.success) {
        const errors = {};

        result.error.issues.forEach((issue) => {
          if (issue.path[0]) {
            errors[issue.path[0]] = issue.message;
          }
        });

        setFormErrors(errors);
        return;
      }

      // Create and Edit APi Integration
      let response;
      if (editMode) {
        response = await editPhone(selectedId, payload);
      } else {
        response = await createPhone(payload);
      }
      if (response) {
        setSnackbar({
          open: true,
          message: response.message,
          severity: "success",
        });
        queryClient.invalidateQueries({ queryKey: ["phone"] });
        handleCloseModal();
      }
    } catch (error) {
      if (Array.isArray(error.response.data)) {
        setSnackbar({
          open: true,
          message: Array.isArray(error.response.data)
            ? JSON.stringify(error.response.data.join(" | "))
            : String(error.response.data),
          severity: "error",
        });
      } else if (error.response.data.message) {
        setSnackbar({
          open: true,
          message: error.response.data.message,
          severity: "error",
        });
      }
    }
  };

  const formMutation = useMutation({
    mutationFn: handleSubmit,
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.message || "Failed to add phone",
        severity: "error",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["phone"] });
    },
  });

  useEffect(() => {
    if (sessionData) {
      setSessionId(sessionData?.session._id);
    }
  }, [sessionData]);

  return (
    <Dialog
      open={modalOpen}
      onClose={(reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          return;
        }
      }}
      fullWidth
    >
      <DialogTitle>{editMode ? "Edit Phone" : "Add Phone"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Phone Number"
          value={form.phone_number}
          type="text"
          onChange={(e) => {
            handleChange("phone_number", e.target.value);
            if (formErrors.phone_number) {
              setFormErrors((prev) => ({ ...prev, phone_number: "" }));
            }
          }}
          error={!!formErrors.phone_number}
          helperText={formErrors.phone_number}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Country Code"
          value={form.country_code}
          type="text"
          onChange={(e) => {
            handleChange("country_code", e.target.value);
            if (formErrors.country_code) {
              setFormErrors((prev) => ({ ...prev, country_code: "" }));
            }
          }}
          error={!!formErrors.country_code}
          helperText={formErrors.country_code}
          fullWidth
          margin="normal"
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={formMutation.mutate}
          type="submit"
          variant="contained"
          disabled={formMutation.isPending}
        >
          {formMutation.isPending ? (
            <CircularProgress size={20} />
          ) : editMode ? (
            "Edit"
          ) : (
            "Add"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
