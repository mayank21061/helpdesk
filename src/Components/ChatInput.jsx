import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Tooltip, styled } from "@mui/material";
import { IconButton, TextField } from "@mui/material";
import { Send } from "@mui/icons-material";
import Loading from "./Loading";
import { HelpdeskContext } from "../ChatContext";
import AttachFileIcon from "@mui/icons-material/AttachFile";

// const CustomTextField = styled(TextField)(({ theme }) => ({
//   "& .MuiOutlinedInput-root": {
//     "& fieldset": {
//       border: "none", // Remove the border
//     },
//   },
// }));

const ChatInput = (props) => {
  const { addUserMsg } = useContext(HelpdeskContext);

  const [loading, setloading] = useState(false);

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
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let formData = { ...values };
      formik.setFieldValue("message", "");
    },
  });

  function askChatGpt(data, action) {
    if (props.screenShot) {
      // addUserMsg(data.userQuery, props.screenShot);
      props.handleClose();
    } else {
      // addUserMsg(data.userQuery);
    }
    action.resetForm();
  }

  //   function
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="chatInput">
        <TextField
          fullWidth
          name="message"
          size="medium"
          multiline
          minRows={2}
          variant="filled"
          placeholder="Message"
          value={formik.values.message}
          onChange={(e) => formik.setFieldValue("message", e.target.value)}
        />

        {/* <IconButton
            disableFocusRipple
            disableRipple
            disableTouchRipple
            onClick={takeScreenshot}
            className="bot-input-SS-btn"
          >
            <AddAPhoto />
          </IconButton>
          {props.screenShot ? (
            <IconButton
              disableFocusRipple
              disableRipple
              disableTouchRipple
              className="bot-input-SS-btn"
            >
              <AddPhotoAlternate />
            </IconButton>
          ) : (
            ""
          )} */}

        {loading && (
          <div className="ss-loading">
            <Loading />
          </div>
        )}
        <div className="input-actions">
          <Tooltip title="ADD ATTACHMENT">
            <IconButton variant="text" size="small">
              <AttachFileIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Button
            type="submit"
            variant="contained"
            size="small"
            disabled={!formik.values.message}
          >
            Send &nbsp;
            <Send fontSize="small" />
          </Button>
        </div>
      </div>
    </form>
  );
};

// const ChatInput = () => {
//   const formik = useFormik();
//   return (
//     <div>
//       <form action="">
//         <TextField />
//       </form>
//     </div>
//   );
// };

export default ChatInput;
