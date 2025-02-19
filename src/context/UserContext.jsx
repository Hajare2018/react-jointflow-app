import React, { useState, useEffect } from 'react';
import HttpClient from '../Api/HttpClient';
import { clearUserInfo, getUserInfo, saveUserInfo } from '../services/local-store';
import Loader from '../components/Loader';

const UserContext = React.createContext({});

export function UserContextProvider({ children }) {
  const basename = `${process.env.PR_NUMBER ? '/pr-' + process.env.PR_NUMBER : ''}`;
  const [lightUserToken, setLightUserToken] = useState(() => {
    const jt = new URLSearchParams(window.location.search).get('jt');
    const token = new URLSearchParams(window.location.search).get('token');

    return jt || token;
  });

  const [userInfo, setUserInfo] = useState(() => {
    // if there is a token in the URL set the userInfo to null because it must be loaded
    if (lightUserToken) {
      return null;
    }

    // return the stored user info if there is no token in the URL
    return getUserInfo();
  });

  const [isUserInitialized, setIsUserInitialized] = useState(() => {
    if (lightUserToken) {
      return false;
    }

    return !!userInfo;
  });

  function onTokenRefresh(token) {
    const newUserInfo = {
      ...userInfo,
      accessToken: token,
    };
    saveUserInfo(newUserInfo);
    setUserInfo(newUserInfo);
  }

  useEffect(() => {
    HttpClient.set401ErrorHandler(onTokenRefresh);
  }, []);

  const [initialising, setInitialising] = useState(true);

  const getUser = async (userType) => {
    const response = await HttpClient.userInfo(
      userType === 'lightUser'
        ? () => {
            return {
              status: 200,
              data: null,
            };
          }
        : undefined,
    );

    if (response.status === 200) {
      return response.data;
    }
  };

  const getUserPermissions = async (userId) => {
    const permissionsResponse = await HttpClient.fetchPermissions({
      user_id: userId,
    });

    if (permissionsResponse.status === 200) {
      return permissionsResponse.data;
    }
  };

  const loginUser = async (username, password) => {
    let formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    try {
      const response = await HttpClient.getToken2({ data: formData });

      if (response.status === 200) {
        const { access, refresh, temp_token } = response.data;

        if (temp_token) {
          return {
            status: 'require-otp',
            token: temp_token,
          };
        }

        // TODO
        // const isPublic = domain.split('.').includes('public');
        // if the subdomain is "public" then it is an admin access token
        HttpClient.setTokens(access, refresh);

        const user = await getUser();
        const permissions = await getUserPermissions(user.id);

        const newUserInfo = {
          accessToken: access,
          refreshToken: refresh,
          details: user,
          permissions,
          userType: 'user',
        };
        saveUserInfo(newUserInfo);
        setUserInfo(newUserInfo);
        setIsUserInitialized(true);
        return {
          status: 'success',
        };
      }
    } catch (e) {
      if (e.message === 'Request failed with status code 400') {
        return {
          status: 'invalid-email-password',
        };
      }

      return {
        status: 'error',
      };
    }
  };

  const verifyOtp = async (otp, token) => {
    try {
      const { status, data } = await HttpClient.otpLogin({
        token,
        otp,
      });

      if (status === 200) {
        const { access, refresh } = data;
        HttpClient.setTokens(access, refresh);

        const user = await getUser();
        const permissions = await getUserPermissions(user.id);

        const newUserInfo = {
          accessToken: access,
          refreshToken: refresh,
          details: user,
          permissions,
          userType: 'user',
        };
        saveUserInfo(newUserInfo);
        setUserInfo(newUserInfo);
        setIsUserInitialized(true);
        return {
          status: 'success',
        };
      }
    } catch (e) {
      if (e.message === 'Request failed with status code 400') {
        return {
          status: 'invalid-otp',
        };
      }
      return {
        status: 'error',
      };
    }
  };

  const logoutUser = async (redirect) => {
    setUserInfo(null);
    setLightUserToken(null);
    clearUserInfo();

    window.location.replace(
      `${basename}/login${redirect ? '?redirect=' + encodeURIComponent(redirect) : ''}`,
    );
  };

  useEffect(() => {
    async function loadUser(type) {
      setInitialising(true);
      const user = await getUser(type);
      if (type === 'lightUser') {
        setUserInfo({
          details: user,
          permissions: null,
          accessToken: lightUserToken,
          refreshToken: null,
          userType: 'lightUser',
        });
      } else {
        setUserInfo((current) => ({
          ...current,
          details: user,
        }));
      }
      setInitialising(false);
      setIsUserInitialized(true);
    }

    // First check whether there is an access token in the URL, if there is use that as the source of truth for user
    if (lightUserToken !== null) {
      // if the userInfo is null, load the light user details
      // when the userInfo is not null
      if (!isUserInitialized) {
        HttpClient.setTokens(lightUserToken);
        loadUser('lightUser');
      }
    } else {
      if (!isUserInitialized) {
        // there is no authenticated user -> redirect to login page
        if (window.location.pathname !== `${basename}/login`) {
          const redirectUrl = window.location.href.substring(window.location.origin.length);
          window.location.replace(
            redirectUrl !== `${basename}`
              ? `${basename}/login?redirect=${encodeURIComponent(redirectUrl)}`
              : `${basename}/login`,
          );
        } else {
          setInitialising(false);
        }
      } else {
        // there is an authenticated user
        if (window.location.pathname === `${basename}/login`) {
          const searchParams = new URLSearchParams(window.location.search);
          if (searchParams.get('redirect')) {
            window.history.replaceState(null, '', decodeURIComponent(searchParams.get('redirect')));
          } else {
            window.history.replaceState(null, '', `${basename}/`);
          }
        } else {
          HttpClient.setTokens(userInfo.accessToken, userInfo.refreshToken);
          // reload the user - it forces to check whether the accessToken is still valid
          loadUser('user');
        }
      }
    }
  }, [lightUserToken, isUserInitialized]);

  const updateUserDetails = (userDetails) => {
    const newUserInfo = {
      ...userInfo,
      details: userDetails,
    };
    saveUserInfo(newUserInfo);
    setUserInfo(newUserInfo);
  };

  const contextValue = {
    user: userInfo === null ? null : userInfo.details,
    permissions: userInfo === null ? null : userInfo.permissions,
    hasToken: !!userInfo,
    hasAdminToken:
      (userInfo !== null && window.location.hostname.split('.')[0] === 'public') ||
      window.location.hostname === 'localhost',
    isAuthenticated: userInfo !== null,
    isTenantUser: userInfo === null ? false : userInfo.userType !== 'lightUser',
    accessToken: userInfo === null ? null : userInfo.accessToken,
    loginUser,
    logoutUser,
    verifyOtp,
    updateUserDetails,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {initialising ? <Loader fullscreen /> : children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const contextValue = React.useContext(UserContext);

  return contextValue;
}
