import { useState, useEffect } from 'react';
import { Button, Typography, Snackbar, Modal, Backdrop, Fade } from '@mui/material';
import { FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { ticketingSystemURL } from '../../services/constant';
import { useNavigate, useLocation } from 'react-router-dom';
import { retrieveToken, decodeTokens, removeToken } from '../../utils/helper';
import { userLogout, userProfile, getActiveLinkForScale } from '../../services/api.services';

const HomePage = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [userDetailsModal, setUserDetailsModal] = useState(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const workspaceId = searchParams.get('workspace_id');
  const institutionName = searchParams.get('institution_name');

  useEffect(() => {
    if (!workspaceId || !institutionName) {
      navigate('/dowelleducation/restricted-access');
    }
    const tokenStatus = decodeTokens(retrieveToken());
    if (tokenStatus.isMyTokenExpired) {
      navigate(`/dowelleducation/?workspace_id=${workspaceId}&institution_name=${institutionName}`);
    }
    const userDetails = tokenStatus?.myDecodedToken;
    setUserDetails(userDetails);
    if (userDetails.role === "admin") {
      setIsAdmin(true);
    }
  }, [location, navigate, workspaceId, institutionName]);

  const handleLogout = async () => {
    const response = await userLogout();
    if (response.status === 200) {
      removeToken();
      navigate(`/dowelleducation/?workspace_id=${workspaceId}&institution_name=${institutionName}`);
    } else {
      setSnackbarMessage(response.data.message);
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleOpenModal = async () => {
    const response = await userProfile();

    if (response.status === 200) {
      setOpenModal(true);
      setUserDetailsModal(response.data.response);
    } else {
      setSnackbarMessage('Failed to fetch user profile');
      setOpenSnackbar(true);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenLearningLevelIndex = async () => {
    try {
      const response = await getActiveLinkForScale(workspaceId);
      if (response.data.success) {
        window.open(response.data.links[0], "_blank");
      } else {
        setSnackbarMessage('No active links found, Please contact the teacher in charge');
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage('Please contact the teacher in charge');
      setOpenSnackbar(true);
    }
  };

  const handleOpenDashboardPage = () => {
    navigate(`/dowelleducation/dashboard/?workspace_id=${workspaceId}&institution_name=${institutionName}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 text-gray-800 p-8">
      <div className="max-w-lg bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
        <div className="flex justify-between w-full space-x-4">
          <Button
            variant="contained"
            fullWidth
            className="p-4 md:p-6 text-white flex items-center justify-center"
            style={{ maxWidth: '200px', borderRadius: '25px', fontSize: '1rem', backgroundColor: '#005734' }}
            startIcon={<FaUser />}
            onClick={handleOpenModal}
          >
          </Button>
          <Button
            variant="contained"
            fullWidth
            className="p-4 md:p-6 text-white flex items-center justify-center"
            style={{ maxWidth: '200px', borderRadius: '25px', fontSize: '1rem', backgroundColor: '#005734' }}
            startIcon={<FaSignOutAlt />}
            onClick={handleLogout}
          >
          </Button>
          {isAdmin && (
            <Button
              variant="contained"
              fullWidth
              className="p-4 md:p-6 text-white flex items-center justify-center"
              style={{ maxWidth: '200px', borderRadius: '25px', fontSize: '1rem', backgroundColor: '#005734' }}
              startIcon={<FaCog />}
              onClick={handleOpenDashboardPage}
            >
            </Button>
          )}
        </div>
        <div className="mt-4 text-left">
          <Typography
            variant="h5"
            className="mb-4 font-bold text-4xl text-blue-900"
            style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '0.05em' }}
          >
            Hey {userDetails?.username},
          </Typography>
          <div className="h-px w-full bg-slate-200 mb-4"></div>
          <Typography
            variant="h6"
            className="mb-8"
            style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '500' }}
          >
            Welcome to {institutionName?.replace(/_/g, " ")}
          </Typography>
          <div className="h-px w-full bg-slate-200 my-4"></div>
        </div>
        <div className="flex flex-col space-y-6 items-center w-full mt-14">
          <Button
            variant="contained"
            fullWidth
            className="p-4 md:p-6 text-white"
            style={{ maxWidth: '250px', borderRadius: '25px', fontSize: '1rem', backgroundColor: '#005734' }}
            onClick={handleOpenLearningLevelIndex}
          >
            Provide Feedback
          </Button>
          <Button
            variant="contained"
            fullWidth
            className="p-4 md:p-6 text-white"
            style={{ maxWidth: '250px', borderRadius: '25px', fontSize: '1rem', backgroundColor: '#005734' }}
            onClick={() => window.open(ticketingSystemURL, "_blank")}
          >
            Query & Ticketing
          </Button>
        </div>
      </div>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto mt-20">
            <Typography variant="h6" className="mb-4 font-bold text-lg text-center text-blue-900">
              User Profile Details
            </Typography>
            {userDetailsModal && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Typography variant="subtitle1" className="font-semibold">
                    Username:
                  </Typography>
                  <Typography variant="body1">
                    {userDetailsModal.username}
                  </Typography>
                </div>
                <div className="flex items-center justify-between">
                  <Typography variant="subtitle1" className="font-semibold">
                    Role:
                  </Typography>
                  <Typography variant="body1">
                    {userDetailsModal.role}
                  </Typography>
                </div>
                <div className="flex items-center justify-between">
                  <Typography variant="subtitle1" className="font-semibold">
                    Workspace ID:
                  </Typography>
                  <Typography variant="body1">
                    {userDetailsModal.workspaceId}
                  </Typography>
                </div>
                <div className="flex items-center justify-between">
                  <Typography variant="subtitle1" className="font-semibold">
                    Institution Name:
                  </Typography>
                  <Typography variant="body1">
                    {userDetailsModal.institutionName}
                  </Typography>
                </div>
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <Button variant="contained" onClick={handleCloseModal}>
                Close
              </Button>
            </div>
          </div>
        </Fade>
      </Modal>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </div>
  );
};

export default HomePage;
