import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { getMe } from "../../axiosRequest/api/editUser";
import { deletePost } from "../../axiosRequest/api/userPost";
import { useCheckToken } from "../../hooks/useCheckToken";
// import {useDeleteSuccessful} from "../../hooks/useDeleteSuccessful";
import { getImageQuality, getToken } from "../../axiosRequest/api/imageQuality";
import axios from "axios";

interface ImageQualityButtonProps {
  filenameString: string | string[] | undefined;
  // userID: string;
}

const currentLoginUserId = async () => {
  try {
    const response = await getMe();
    const { id } = response.data;
    return id;
  } catch (error) {}
};
const ImageQualityButton: FC<ImageQualityButtonProps> = ({ filenameString }) => {
  useCheckToken();

  const { userID, isAuthenticated } = useSelector((state: RootState) => ({
    ...state.auth,
    ...state.quickView,
  }));
  // const {isDeleteSuccessful, updateIsDeleteSuccessful} = useDeleteSuccessful();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isCurrentUserId, setIsCurrentUserId] = useState<boolean>(false);
  const [isSendSuccessful, setIsSendSuccessful] = useState(false);
  // const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [qualityScore, setQualityScore] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUserId = async () => {
      const trueUser = await currentLoginUserId();
      const isMatch = trueUser === userID;
      setIsCurrentUserId(isMatch);
    };
    fetchUserId();
    if (isSendSuccessful) {
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }, [userID, isSendSuccessful]);

  const handleGetQualityClick = async () => {
    const S3Url = "https://fotopie-photo-compression.s3.ap-southeast-2.amazonaws.com";
    const compressed_url = `${S3Url}/${filenameString}`;
    setIsConfirmationOpen(true);

    try {
      const response = await getToken();
      console.log(response.data, "debug");
    } catch (error) {
      console.log(error);
    }

    // try {
    //   const response = await getImageQuality(compressed_url);
    //   console.log(response.data, 'debug');
      
    // } catch (error) {
    //   console.log(error);
    // }

    // try {
    //   const response = await getImageQuality(compressed_url);
    //   console.log(response.data, "debug");
    // } catch (error) {
    //   console.log(error);
    // }
    const API_ENDPOINT = "http://localhost:9090"; 

    async function getQuality(url: string, data: Record<string, any>) {
      const response = await axios.get(`${API_ENDPOINT}/api/everypixel/quality`, {
        params: { url },
        data,
      });
      return response.data;
      console.log(response.data, "debug1");
    }

    getQuality(compressed_url, { size: "medium" })
      .then((result) => {
        setQualityScore(result.quality.score);
        console.log(result.quality.score);
      })
      
      .catch((error) => {
        console.error(error);
      });
    

    

  };

  const handleConfirmationCancel = () => {
    setIsConfirmationOpen(false);
  };

  const handleConfirmationConfirm = async () => {
    setIsDeleting(true);
    setIsConfirmationOpen(false);
    try {
      const response = await deletePost(filenameString);
      setIsConfirmationOpen(true);
      setIsSendSuccessful(true);
    } catch (error) {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {isAuthenticated && isCurrentUserId ? (
        <div>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleGetQualityClick}
            disabled={isDeleting}
          >
            <Typography
              textTransform="none"
              fontWeight={700}
              fontSize={{
                xs: "0.5rem",
                sm: "0.75rem",
                md: "1rem",
              }}
            >
              {isDeleting ? "Sending..." : "Get image quality"}
            </Typography>
          </Button>

          <Dialog open={isConfirmationOpen} onClose={handleConfirmationCancel}>
            <DialogTitle>Calculate Quality Score</DialogTitle>

            {/* dialog content body */}
            <DialogContent>
              {isSendSuccessful ? (
                <DialogContentText>
                  Sending successful! Redirecting...
                </DialogContentText>
              ) : (
                // "Your photo score is: `${qualityScore}`.Are you sure you want to rank this post?"
                <DialogContentText>
                  Your photo score is: "{qualityScore}".Are you sure you want to
                  rank this post?
                </DialogContentText>
              )}
            </DialogContent>

            {/* first dialog button */}
            {isSendSuccessful ? null : (
              <DialogActions>
                <Button onClick={handleConfirmationCancel} color="primary">
                  Cancel
                </Button>
                {/* click this button will call delete api and will popup second dialog*/}
                <Button
                  onClick={handleConfirmationConfirm}
                  color="primary"
                  autoFocus
                >
                  Send
                </Button>
              </DialogActions>
            )}
          </Dialog>
        </div>
      ) : null}
    </>
  );
};

export default ImageQualityButton;
