import React, { useContext, useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
  styled,
} from "@mui/material";
import { IconButton, TextField } from "@mui/material";
import { Send } from "@mui/icons-material";
import Loading from "./Loading";
import { HelpdeskContext } from "../ChatContext";
import AttachFileIcon from "@mui/icons-material/AttachFile";

const ChatInput = (props) => {
  const { sender, addUserMsg } = useContext(HelpdeskContext);

  const [loading, setloading] = useState(false);

  const fileInputRef = useRef(null);

  const [alertMessage, setAlertMessage] = useState(false);

  const validationSchema = Yup.object({
    message: Yup.string()
      .trim()
      .test((message) => {
        if (message) return true;
        else return false;
      }),
  });
  const initialValues = {
    message: "",
    attachmentFiles: null,
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: askChatGpt,
  });

  function askChatGpt(data, action) {
    if (data.attachmentFiles) {
      addUserMsg(data.message, data.attachmentFiles);
    } else {
      addUserMsg(data.message);
    }
    action.resetForm();
  }

  const handleAttachment = (e) => {
    fileInputRef.current.click();
  };

  const handleFullScreen = () => {
    let src = URL.createObjectURL(formik.values.attachmentFiles);
    window.open(src);
  };

  const handleFileChange = async (event) => {
    const files = await event.target.files[0];
    if (files?.size > 25 * 1024 * 1024) {
      setAlertMessage(true);
    } else if (files) {
      formik.setFieldValue("attachmentFiles", files);
    }
  };

  return (
    sender && (
      <form onSubmit={formik.handleSubmit}>
        <div className="chatInput">
          <Dialog open={alertMessage} onClose={() => setAlertMessage(false)}>
            <DialogTitle>File cannot be uploaded</DialogTitle>
            <DialogContent>
              <DialogContentText fontSize="medium">
                Size of supporting document should be less than 25 MB.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setAlertMessage(false)}
                variant="contained"
                size="small"
              >
                Agree
              </Button>
            </DialogActions>
          </Dialog>
          <TextField
            fullWidth
            name="message"
            size="medium"
            // multiline
            minRows={2}
            variant="filled"
            placeholder="Message"
            value={formik.values.message}
            onChange={(e) => formik.setFieldValue("message", e.target.value)}
          />

          {loading && (
            <div className="ss-loading">
              <Loading />
            </div>
          )}
          <div className="input-actions">
            {formik.values.attachmentFiles ? (
              <div>
                <Chip
                  label={formik.values.attachmentFiles.name}
                  onClick={(e) => handleFullScreen(e.target.value)}
                  onDelete={() => {
                    formik.setFieldValue("attachmentFiles", null);
                  }}
                />
              </div>
            ) : (
              <div>
                <Tooltip title="ADD ATTACHMENT">
                  <IconButton
                    variant="text"
                    size="small"
                    onClick={(e) => {
                      handleAttachment(e);
                    }}
                  >
                    <AttachFileIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <input
                  // multiple
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  accept=".pdf"
                />
              </div>
            )}

            <div>
              <Button
                type="submit"
                variant="contained"
                size="small"
                disabled={
                  !Boolean(formik.values.message) &&
                  !Boolean(formik.values.attachmentFiles)
                }
              >
                Send &nbsp;
                <Send fontSize="small" />
              </Button>
            </div>
          </div>
        </div>
      </form>
    )
  );
};

export default ChatInput;
