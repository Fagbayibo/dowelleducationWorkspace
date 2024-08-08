const RestrictedAccessPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
      <div className="max-w-md sm:max-w-lg md:max-w-xl p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Access Restricted</h2>
        <p className="text-gray-600 mb-4">
          You are not allowed to access this page without a valid workspace ID.
        </p>
      </div>
    </div>
  );
};

export default RestrictedAccessPage;
