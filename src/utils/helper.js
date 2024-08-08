import { isExpired, decodeToken } from "react-jwt";

export const storeToken = (token) => {
    localStorage.setItem('accessToken', token);
};

export const retrieveToken = () => {
    return localStorage.getItem('accessToken');
};

export const removeToken = () => {
    localStorage.removeItem('accessToken');
};
export const decodeTokens = (token) => {
    try {
        const myDecodedToken = decodeToken(token);
        const isMyTokenExpired = isExpired(token);

        return {
            myDecodedToken,
            isMyTokenExpired
        };
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};
