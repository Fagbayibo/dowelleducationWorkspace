import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import QRCodeCard from "../../components/QRCodeCard";
import { FaCirclePlus } from "react-icons/fa6";
import Code from "../../assets/Code.png"; // Replace with your actual path
import { useNavigate } from "react-router-dom";
import { decodeToken } from "../../utils/tokenUtils";

const WorkspaceScaleDetails = () => {
  const [qrCodes, setQrCodes] = useState([]);
  const [alert, setAlert] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  useEffect(() => {
    if (!accessToken || !refreshToken) {
      navigate("/dowelleducation/workspace-login");
    }
  }, [accessToken, refreshToken, navigate]);

  useEffect(() => {
    const fetchScaleDetails = async () => {
      const token = localStorage.getItem("accessToken");

      if (token) {
        setLoading(true); // Set loading to true before fetching

        try {
          const decodedPayload = decodeToken(token);
          const workspaceId = decodedPayload.workspace_id;
          const portfolio = decodedPayload.portfolio;

          const response = await fetch(
            "https://100035.pythonanywhere.com/voc/api/v1/scale-management/?type=scale_details",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                workspace_id: workspaceId,
                portfolio: portfolio,
              }),
            }
          );

          const data = await response.json();
          console.log("Scale Details Response:", data);

          if (data.success && data.response.length > 0) {
            setQrCodes(data.response);

            // Store the scale_id in localStorage
            const scaleId = data.response[0].scale_id;
            localStorage.setItem("scale_id", scaleId);
          } else {
            setAlert("No scale found, please Create a scale for yourself");
            setTimeout(() => setAlert(""), 3000);

            // Hit the API to create a new scale
            handleButtonClick();
          }
        } catch (error) {
          console.error("Error fetching scale details:", error.message);
        } finally {
          setLoading(false); // Set loading to false after fetching or error
        }
      } else {
        console.error("No access token found in local storage.");
        setLoading(false);
      }
    };

    fetchScaleDetails();
  }, [accessToken, navigate]);

  const handleButtonClick = async () => {
    const token = localStorage.getItem("accessToken");
    const decodedPayload = decodeToken(token);
    const workspaceId = decodedPayload.workspace_id;
    const portfolio = decodedPayload.portfolio;
    const hardCodedData = {
      workspace_id: workspaceId,
      username: "manish_test error_login",
      portfolio: portfolio,
    };

    setLoading(true); // Set loading to true before creating scale

    try {
      const response = await fetch(
        "https://100035.pythonanywhere.com/voc/api/v1/scale-management/?type=save_scale_details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(hardCodedData),
        }
      );

      const data = await response.json();
      console.log("Create Scale Response:", data);

      if (response.ok) {
        const newId = qrCodes.length ? qrCodes[qrCodes.length - 1].id + 1 : 1;
        setQrCodes([
          ...qrCodes,
          {
            id: newId,
            imageSrc: Code,
            qrDetails: data.qrDetails || `QR Code ${newId}`,
            scaleDetails: data.scaleDetails || "Scale Details",
          },
        ]);
        setAlert("QR Code card created successfully!");

        // Store the scale_id in localStorage
        const scaleId = data.scale_id; // Adjust based on actual response
        localStorage.setItem("scale_id", scaleId);

        setTimeout(() => setAlert(""), 3000);
      } else {
        setAlert(data.message || "Failed to create card.");
        setTimeout(() => setAlert(""), 3000);
      }
    } catch (error) {
      console.error("Error creating card:", error);
      setAlert("Error creating card.");
      setTimeout(() => setAlert(""), 3000);
    } finally {
      setLoading(false); // Set loading to false after creating or error
    }
  };

  const handleCopy = (qrDetails) => {
    navigator.clipboard.writeText(qrDetails).then(() => {
      setAlert("QR Code copied to clipboard!");
      setTimeout(() => setAlert(""), 3000);
    });
  };

  return (
    <div className="max-h-screen max-w-full relative">
      <Navbar />
      <div className="flex-col flex">
        <div className="flex mt-2 flex-col md:flex-row flex-wrap md:gap-4 p-6 gap-4">
          {loading ? (
            <div className="flex justify-center items-center w-full h-full">
              <p>Loading...</p>
            </div>
          ) : (
            <div className="flex justify-center flex-col md:flex-row flex-wrap md:gap-4 p-1 gap-4">
              {qrCodes.map((qrCode) => (
                <div
                  key={qrCode._id}
                  className="flex flex-col gap-6"
                >
                  <div className="flex-col flex gap-2">
                    <h1 className="text-[25px] font-bold font-poppins">
                      Scale Details
                    </h1>
                    <div className="flex flex-col md:flex-row gap-6 flex-wrap">
                      <QRCodeCard
                        imageSrc={qrCode.links_details[0].qrcode_image_url}
                        instanceName={qrCode.username}
                        scaleLink={qrCode.links_details[0].scale_link}
                        qrCodeLink={qrCode.report_link.qrcode_image_url}
                        type="scale"
                        onClick={() =>
                          handleCopy(qrCode.report_link.qrcode_image_url)
                        }
                      />
                      <QRCodeCard
                        imageSrc={qrCode.links_details[1].qrcode_image_url}
                        instanceName={qrCode.username}
                        scaleLink={qrCode.links_details[1].scale_link}
                        qrCodeLink={qrCode.report_link.qrcode_image_url}
                        type="scale"
                        onClick={() =>
                          handleCopy(qrCode.report_link.qrcode_image_url)
                        }
                      />
                      <QRCodeCard
                        imageSrc={qrCode.links_details[2].qrcode_image_url}
                        instanceName={qrCode.username}
                        scaleLink={qrCode.links_details[2].scale_link}
                        qrCodeLink={qrCode.report_link.qrcode_image_url}
                        type="scale"
                        onClick={() =>
                          handleCopy(qrCode.report_link.qrcode_image_url)
                        }
                      />
                      <QRCodeCard
                        imageSrc={qrCode.links_details[3].qrcode_image_url}
                        instanceName={qrCode.username}
                        scaleLink={qrCode.links_details[3].scale_link}
                        qrCodeLink={qrCode.report_link.qrcode_image_url}
                        type="scale"
                        onClick={() =>
                          handleCopy(qrCode.report_link.qrcode_image_url)
                        }
                      />
                      <QRCodeCard
                        imageSrc={qrCode.links_details[4].qrcode_image_url}
                        instanceName={qrCode.username}
                        scaleLink={qrCode.links_details[4].scale_link}
                        type="scale"
                        qrCodeLink={qrCode.report_link.qrcode_image_url}
                        onClick={() =>
                          handleCopy(qrCode.report_link.qrcode_image_url)
                        }
                      />
                    </div>
                  </div>
                  <div className="flex-col flex gap-2">
                    <h1 className="text-[25px] font-bold font-poppins">
                      Report Details
                    </h1>
                    <div className="flex flex-col md:flex-row gap-6">
                      <QRCodeCard
                        imageSrc={qrCode.report_link.qrcode_image_url}
                        instanceName={qrCode.username}
                        type="report"
                        qrCodeLink={qrCode.report_link.qrcode_image_url}
                        reportLink={qrCode.report_link.report_link}
                        onClick={() =>
                          handleCopy(qrCode.report_link.qrcode_image_url)
                        }
                      />
                      <QRCodeCard
                        imageSrc={qrCode.report_link.qrcode_image_url}
                        instanceName={qrCode.username}
                        type="report"
                        qrCodeLink={qrCode.report_link.qrcode_image_url}
                        reportLink={qrCode.report_link.report_link}
                        onClick={() =>
                          handleCopy(qrCode.report_link.qrcode_image_url)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={handleButtonClick}
                className="bg-deepblue text-white shadow-xl px-2 py-2 rounded-full mt-4 md:mt-0 fixed md:bottom-[90px] bottom-[50px] md:right-12 right-8 z-2"
              >
                <FaCirclePlus className="size-8" />
              </button>
            </div>
          )}
        </div>
      </div>
      {alert && (
        <div
          className="fixed top-24 right-4 flex items-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
          role="alert"
        >
          <svg
            className="flex-shrink-0 inline w-4 h-4 me-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium"> {alert}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceScaleDetails;
