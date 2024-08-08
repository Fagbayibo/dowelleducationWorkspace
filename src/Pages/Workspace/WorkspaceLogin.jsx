import { useState, useEffect } from "react";
import Logo from "../../assets/VOC.png";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";

const WorkspaceLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [healthStatus, setHealthStatus] = useState(null);
  const [formData, setFormData] = useState({
    workspace: "",
    portfolioId: "",
    password: "",
  });
  const [statusMessage, setStatusMessage] = useState("");

  const checkServerHealth = async () => {
    try {
      const response = await fetch(
        "https://100035.pythonanywhere.com/voc/api/v1/health-check/"
      );
      const healthData = await response.json();
      setHealthStatus(healthData.success ? "healthy" : "Unhealthy");
    } catch (error) {
      setHealthStatus("Unhealthy");
    }
  };

  useEffect(() => {
    checkServerHealth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await fetch(
        "https://100035.pythonanywhere.com/voc/api/v1/user-management/?type=login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      const result = await response.json();
      if (response.ok && result.success) {
        console.log("Login successful:", result);
        localStorage.setItem("refreshToken", result.refresh_token);
        localStorage.setItem("workspaceId", credentials.workspace_id); // Store workspace_id
        return result;
      } else {
        console.error("Login failed:", result);
        throw new Error(result.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const getToken = async (refreshToken) => {
    try {
      const response = await fetch(
        "https://100035.pythonanywhere.com/voc/api/v1/user-management/?type=get_access_token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        }
      );

      const tokenResult = await response.json();
      if (response.ok && tokenResult.success) {
        localStorage.setItem("accessToken", tokenResult.access_token);
        console.log("Access Token:", tokenResult.access_token);
        return tokenResult.access_token;
      } else {
        console.error("Token fetch failed:", tokenResult);
        throw new Error(tokenResult.message || "Failed to fetch token");
      }
    } catch (error) {
      console.error("Token fetch error:", error);
      throw error;
    }
  };

  const signup = async (credentials) => {
    try {
      const response = await fetch(
        "https://100035.pythonanywhere.com/voc/api/v1/user-management/?type=sign-up",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );
      const result = await response.json();
      if (response.ok && result.success) {
        localStorage.setItem("workspaceId", credentials.workspace); // Store workspace_id
        return result;
      } else {
        throw new Error(result.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const credentials = {
      workspace_id: formData.workspace,
      portfolio: formData.portfolioId,
      password: formData.password,
    };

    try {
      let loginResponse;
      try {
        loginResponse = await login(credentials);
      } catch (error) {
        if (error.message === "User does not exist") {
          setStatusMessage("User does not exist, attempting to sign up...");
          const signupResponse = await signup(credentials);
          if (signupResponse.success) {
            setStatusMessage("Successfully signed up, attempting to log in...");
            loginResponse = await login(credentials);
          } else {
            setStatusMessage("Signup failed.");
            console.error("Signup failed:", signupResponse);
            setLoading(false);
            return;
          }
        } else {
          setStatusMessage("Login error.");
          console.error("Login error:", error);
          setLoading(false);
          return;
        }
      }

      if (loginResponse.success) {
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) {
            throw new Error("Refresh token not found");
          }
          const accessToken = await getToken(refreshToken);
          if (accessToken) {
            navigate("/dowelleducation/workspace-report");
          } else {
            setStatusMessage("Failed to retrieve access token.");
          }
        } catch (error) {
          setStatusMessage("Error fetching access token.");
          console.error("Error fetching access token:", error);
        }
      } else {
        setStatusMessage("Login failed after signup.");
        console.error("Login failed after signup.");
      }
    } catch (error) {
      if (error.message.includes("<!DOCTYPE")) {
        setStatusMessage(
          "Received HTML instead of JSON. Possible server issue."
        );
        console.error("Received HTML instead of JSON. Possible server issue.");
      } else {
        setStatusMessage("Error during login/signup.");
        console.error("Error during login/signup:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className="max-h-screen flex flex-col relative">
      <div className="flex flex-col gap-1 justify-center items-center mt-10">
        <div className="fixed right-8 top-5">
          {healthStatus && (
            <div
              className={`w-6 h-6 rounded-full ${
                healthStatus === "healthy"
                  ? "bg-green-500 animate-pulse"
                  : "bg-red-500 animate-pulse"
              }`}
            />
          )}
        </div>
        <img src={Logo} width={300} height={300} alt="Dowell Logo" />
        <form
          className="md:w-[320px] min-w-64 flex flex-col gap-4 items-center"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="workspace"
            placeholder="Select Workspace"
            className="cursor-pointer bg-gray-100 border flex items-center justify-between font-medium p-2.5 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            value={formData.workspace}
            onChange={handleChange}
          />
          <input
            type="text"
            name="portfolioId"
            placeholder="Enter Portfolio ID"
            className="cursor-pointer bg-gray-100 border flex items-center justify-between font-medium p-2.5 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            value={formData.portfolioId}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            className="cursor-pointer bg-gray-100 border flex items-center justify-between font-medium p-2.5 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="submit"
            className={`w-40 py-2 text-sm font-semibold rounded-md ${
              loading
                ? "bg-lightblue cursor-not-allowed text-black"
                : "bg-deepblue"
            } text-white`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <CircularProgress color="success" size={20} />
                Loading...
              </div>
            ) : (
              "Confirm"
            )}
          </button>
          {statusMessage && (
            <p className="mt-2 text-center text-red-600">{statusMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default WorkspaceLogin;
