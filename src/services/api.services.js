import axios from "axios";
import { retrieveToken } from "../utils/helper";
const servicesAxiosInstance = axios.create({
  baseURL: "https://www.samantaedu.uxlivinglab.online"
});

const userLogin = async (username, password, workspaceId, institutionName) => {
  return await servicesAxiosInstance.post(
    `/api/v1/auth/login`,
    { username, password, workspaceId, institutionName }
  );
};

const userLogout = async() => {
  const headers = {
    Authorization: `Bearer ${retrieveToken()}`,
  };
  return await servicesAxiosInstance.get(  
    `/api/v1/auth/logout`, 
    {headers}
  )
}

const userProfile = async () => {
  const headers = {
    Authorization: `Bearer ${retrieveToken()}`,
  };
  return await servicesAxiosInstance.get(
    `/api/v1/auth/user-details`,
    {headers}
  )
}

const getScaleLinkForLearningLevelIndex = async (workspaceId) => {
  const headers = {
    Authorization: `Bearer ${retrieveToken()}`,
  }
  return await servicesAxiosInstance.get(
    `/api/v1/scale-link/${workspaceId}`,
    {headers}
  );
}

const saveLearningIndexLink = async (workspaceId,username) =>{
  const headers = {
    Authorization: `Bearer ${retrieveToken()}`,
  }

  return await servicesAxiosInstance.post(
    `/api/v1/scale-link/save`,
    {workspaceId, username},
    {headers}
  );
}

const updateScaleLinkId = async (workspaceId,linkId) => {
  const headers = {
    Authorization: `Bearer ${retrieveToken()}`,
  }

  return await servicesAxiosInstance.put(
    `/api/v1/scale-link/update-scale-link/?workspaceId=${workspaceId}&linkId=${linkId}`,
    {headers}
  );
}

const getActiveLinkForScale = async (workspaceId) =>{
  const headers = {
    Authorization: `Bearer ${retrieveToken()}`,
  }

  return await servicesAxiosInstance.get(
    `/api/v1/scale-link/active-links/${workspaceId}`,
    {headers}
  );
}
export {
  userLogin,
  userLogout,
  userProfile,
  getScaleLinkForLearningLevelIndex,
  saveLearningIndexLink,
  updateScaleLinkId,
  getActiveLinkForScale
}
