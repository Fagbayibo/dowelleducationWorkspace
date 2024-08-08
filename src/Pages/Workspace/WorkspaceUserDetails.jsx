import Navbar from "../../components/Navbar";
import profileLogo from "../../assets/profile.png";
import { PencilSquareIcon } from "@heroicons/react/20/solid";
import { useRef, useState, useEffect } from "react";

const WorkspaceUserDetails = () => {
  const inputRef = useRef(null);
  const [image, setImage] = useState(() => localStorage.getItem("profileImage"));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // State for success message
  const [alert, setAlert] = useState(""); // State for form submission message
  const [formData, setFormData] = useState(() => {
    // Load form data from localStorage if available
    const savedData = localStorage.getItem("formData");
    return savedData ? JSON.parse(savedData) : {
      firstName: "Johnathan",
      lastName: "Doenzelio",
      timeZone: "+5 GMT",
      phone: "555-254-4545",
      email: "johnathan.smith.doenzelio@website.com",
      password: "",
      portfolioId: "42354627118"
    };
  });

  useEffect(() => {
    // Save the image to localStorage when it changes
    if (image) {
      localStorage.setItem("profileImage", image);
    }
  }, [image]);

  useEffect(() => {
    // Save form data to localStorage whenever formData changes
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  const handleImageClick = () => {
    inputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setMessage("Image uploaded successfully!"); // Set success message
        setTimeout(() => setMessage(""), 3000); // Remove message after 3 seconds
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    // Simulate API call or asynchronous operation
    setTimeout(() => {
      setLoading(false);
      setAlert("Changes saved successfully!"); // Set form submission message
      setTimeout(() => setAlert(""), 3000); // Remove alert after 3 seconds
    }, 2000);
  };

  return (
    <div className="max-h-screen max-w-full">
      <Navbar />
      <div className="flex flex-col md:flex-row md:p-12 p-2 h-full">
        {/* Left side */}
        <div className="flex flex-col items-center mt-5 md:w-2/5 w-full mb-6">
          <div className="border border-semiblue rounded-full w-52 h-52">
            {image ? (
              <img
                src={image}
                alt="Profile"
                className="rounded-full w-full h-full object-cover"
              />
            ) : (
              <img
                src={profileLogo}
                alt="Profile Placeholder"
                className="rounded-full w-full h-full object-cover p-3"
              />
            )}
          </div>

          <input
            type="file"
            ref={inputRef}
            className="hidden"
            onChange={handleImageChange}
          />
          <button
            onClick={handleImageClick}
            className="flex items-center text-[18px] font-semibold gap-2 bg-lightblue mt-4 px-4 rounded-xl py-1 border-[0.5px] border-deepblue text-deepblue"
          >
            <PencilSquareIcon className="w-5 text-[#0079E3]" /> Edit
          </button>
          {message && (

            <div className=" mt-3 flex items-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
            <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
            </svg>
            <span className="sr-only">Info</span>
            <div>
              <span className="font-medium">{message}</span> 
            </div>
          </div>
          )}
        </div>
        {/* Right side */}
        <div className="flex flex-col md:w-3/5 w-full md:pl-8 p-4">
          <h2 className="text-2xl font-semibold mb-6">Personal Information</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Time Zone</label>
              <select
                name="timeZone"
                value={formData.timeZone}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option>+5 GMT</option>
                <option>+6 GMT</option>
                <option>+7 GMT</option>
                {/* Michael: time zones as much need */}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex flex-col md:col-span-2">
              <label className="font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <h2 className="text-2xl font-semibold mb-4 mt-9 md:col-span-2">Security Information</h2>
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="****************"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Portfolio ID</label>
              <input
                type="text"
                name="portfolioId"
                value={formData.portfolioId}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className={`w-40 py-2 text-sm font-semibold rounded-md mt-4 ${
                loading ? "bg-lightblue cursor-not-allowed text-black" : "bg-deepblue text-white"
              }`}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  <span>Processing...</span>
                </div>
              ) : (
                "Save Changes"
              )}
            </button>
          </form>
          {alert && (
        <div
          className="fixed top-4 right-4 flex items-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
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
            <span className="font-medium">{alert}</span> 
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceUserDetails;
