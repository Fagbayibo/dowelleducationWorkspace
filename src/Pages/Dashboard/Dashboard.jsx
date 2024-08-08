import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Card,
  CardContent,
  Typography,
  Modal,
  Box,
  IconButton,
  Divider,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { Home as HomeIcon } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from '@mui/icons-material/Close';
import {
  getScaleLinkForLearningLevelIndex,
  updateScaleLinkId,
  saveLearningIndexLink as saveLearningIndexLinkApi,
} from "../../services/api.services";
import { useNavigate, useLocation } from "react-router-dom";
import { retrieveToken, decodeTokens} from "../../utils/helper";

const Dashboard = () => {
  const navigate = useNavigate();
  const [scales, setScales] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedScale, setSelectedScale] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNotice, setShowNotice] = useState(true); 
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const workspaceId = searchParams.get("workspace_id");
  const institutionName = searchParams.get("institution_name");

  // const workspaceId = "66879a901c299b49c227088b";
  const username = decodeTokens(retrieveToken())?.myDecodedToken.username;
  // const username = "samantaeducation";

  const handleGetLearningIndexScale = async () => {
    try {
      setLoading(true);
      const response = await getScaleLinkForLearningLevelIndex(workspaceId);
      if (response.data.success) {
        setSnackbarMessage(response.data.message);
        setSnackbarOpen(true);
        setScales(response.data.response);
      } else {
        setSnackbarMessage("Failed to fetch learning index scale links");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("Error fetching learning index scale links");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!workspaceId || !institutionName) {
      navigate("/dowelleducation/restricted-access");
    }
    handleGetLearningIndexScale();

    const tokenStatus = decodeTokens(retrieveToken());
    if (tokenStatus.isMyTokenExpired) {
      navigate(`/dowelleducation/?workspace_id=${workspaceId}&institution_name=${institutionName?.replace(/_/g, " ")}`);
    }

    setShowNotice(true);
    const noticeTimeout = setTimeout(() => {
      setShowNotice(true);
    }, 5000);

    return () => clearTimeout(noticeTimeout);
  }, [institutionName, navigate,workspaceId]);

  const handleOpen = (scale) => {
    setSelectedScale(scale);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedScale(null);
  };

  const handleActivateLink = async (linkId, isActive) => {
    try {
      setLoading(true);
      const response = await updateScaleLinkId(workspaceId, linkId);

      if (response.data.success) {
        setSnackbarMessage(`Link ${isActive ? "activated" : "deactivated"} successfully`);
        setSnackbarOpen(true);
        handleGetLearningIndexScale()
        const updatedScales = scales.map((scale) => {
          if (scale._id === selectedScale._id) {
            const updatedLinks = scale.links.map((link) => {
              if (link._id === linkId) {
                return { ...link, isActive };
              }
              return link;
            });
            return { ...scale, links: updatedLinks };
          }
          return scale;
        });
        setScales(updatedScales);
      } else {
        setSnackbarMessage(`Failed to ${isActive ? "activate" : "deactivate"} link`);
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage(`Error ${isActive ? "activating" : "deactivating"} link`);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLearningIndexLink = async () => {
    try {
      setLoading(true);
      const response = await saveLearningIndexLinkApi(workspaceId, username);

      if (response.data.success) {
        setSnackbarMessage(response.data.message);
        setSnackbarOpen(true);
        handleGetLearningIndexScale()
      } else {
        setSnackbarMessage("Failed to save learning index link");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("Error saving learning index link");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar className="justify-between">
          <Typography variant="h6">Dashboard</Typography>
          <div className="flex">
            <IconButton color="inherit" onClick={handleSaveLearningIndexLink}>
              <AddIcon />
            </IconButton>
            <IconButton color="inherit" onClick={() => navigate(`/dowelleducation/home/?workspace_id=${workspaceId}&institution_name=${institutionName}`)}>
              <HomeIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <div className="p-6 bg-gray-50">
        {showNotice && (
          <div className="flex justify-center items-center bg-yellow-200 text-yellow-800 p-2 rounded-lg mb-4">
            Is any scale is missing ? Click to update it 
            <IconButton color="inherit" onClick={handleSaveLearningIndexLink}>
              <AddIcon />
            </IconButton>.
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <CircularProgress color="primary" />
          ) : scales.length === 0 ? (
            <Typography variant="h6" className="flex justify-center items-center text-center text-gray-600">
              No scales found. Please create a new scale in DoWell Scale
            </Typography>
          ) : (
            scales.map((scale) => (
              <Card
                key={scale._id}
                className="cursor-pointer hover:shadow-lg transition-shadow rounded-lg overflow-hidden"
                onClick={() => handleOpen(scale)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-row items-start justify-between">
                    <div className="m-2 flex flex-col items-start justify-evenly">
                      <Typography
                        variant="h6"
                        className="font-extrabold text-slate-800 flex items-center justify-center text-xl border-b border-gray-300"
                      >
                        Scale Name:{" "}
                        <span className="ml-2 font-medium text-blue-500 text-base">
                          {scale.scaleName}
                        </span>
                      </Typography>
                      <Typography className="text-gray-900 flex pt-1">
                        Scale Type:{" "}
                        <span className="ml-3.5 text-gray-600">{scale.scaleType?.replace(/_/g, " ")}</span>
                      </Typography>
                      <div className="flex items-center mt-2">
                        <Typography className="mr-2 text-gray-700">Status:</Typography>
                        {scale.links.some((link) => link.isActive) ? (
                          <div className="flex items-center ml-4">
                            <div className="bg-green-500 h-4 w-4 rounded-full mr-1"></div>
                            <Typography className="text-green-600">Active</Typography>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <div className="bg-red-500 h-4 w-4 rounded-full mr-1"></div>
                            <Typography className="text-red-600">Inactive</Typography>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white shadow-lg border-2 border-white hover:shadow-2xl transform transition-transform duration-300 hover:scale-110">
                      {scale.links.length}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <Modal open={open} onClose={handleClose}>
        <Box
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-2xl max-w-lg w-full"
          sx={{ border: "none" }}
        >
          {selectedScale && (
            <>
              <Typography variant="h4" className="font-bold mb-3.5 text-blue-800 border-b border-gray-300 pb-0.5 text-center">
                Scale Details
              </Typography>
              <Typography className="my-4 text-gray-800">
                <strong className="text-gray-600 text-lg mr-2">Scale Name:</strong> {selectedScale.scaleName}
              </Typography>
              <Typography className="my-4 text-gray-800">
                <strong className="text-gray-600 text-lg mr-2">Scale Type:</strong> {selectedScale.scaleType}
              </Typography>
              <Typography className="my-4 text-gray-800">
                <strong className="text-gray-600 text-lg mr-2">Workspace ID:</strong> {selectedScale.workspaceId}
              </Typography>
              <Typography className="my-4 text-gray-800">
                <strong className="text-gray-600 text-lg mr-2">Channel Count:</strong> {selectedScale.channelCount}
              </Typography>
              <Typography className="my-5 text-gray-800">
                <strong className="text-gray-600 text-lg mr-2">Number of Links:</strong> {selectedScale.links.length}
              </Typography>
              <Divider className="my-11" />
              <Typography variant="h5" className="font-bold p-2 text-blue-800">
                Links
              </Typography>
              <div className="max-h-[150px] overflow-y-auto custom-scrollbar">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                  <thead className="bg-gray-200 text-gray-700">
                    <tr>
                      <th className="py-3 px-6 text-left">#</th>
                      <th className="py-3 px-6 text-left">Channel Name</th>
                      <th className="py-3 px-6 text-left">Instance Name</th>
                      <th className="py-3 px-6 text-left">Link</th>
                      <th className="py-3 px-6 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedScale.links.map((link, index) => (
                      <tr
                        key={link._id}
                        className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors duration-300`}
                      >
                        <td className="py-3 px-6 text-gray-800">{index + 1}</td>
                        <td className="py-3 px-6 text-gray-800">{link.channelDisplayName}</td>
                        <td className="py-3 px-6 text-gray-800">{link.instanceDisplayName}</td>
                        <td className="py-3 px-6 text-gray-800">***</td>
                        <td className="py-3 px-6 text-center">
                          <Button
                            variant="contained"
                            color={link.isActive ? "primary" : "secondary"}
                            className="text-sm"
                            onClick={() => handleActivateLink(link._id, !link.isActive)}
                          >
                            {link.isActive ? "Deactivate" : "Activate"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-right my-4">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleClose}
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={() => setSnackbarOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </div>
  );
};

export default Dashboard;
