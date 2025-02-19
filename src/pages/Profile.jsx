import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import HttpClient from '../Api/HttpClient';
import Loader from '../components/Loader';
import ProfileTab from '../components/Profile/ProfileTab';
import { useUserContext } from '../context/UserContext';

function Profile() {
  const loader = useSelector((state) => state.showLoader);
  const { user } = useUserContext();

  useEffect(() => {
    window.pendo.initialize({
      visitor: {
        id: user?.id,
        email: user?.email,
        full_name: user?.first_name + ' ' + user?.last_name,
        role: user?.role,
        page: 'Profile Page',
      },
      account: { id: HttpClient.tenant() },
    });
  }, []);

  return loader.show ? (
    <Loader />
  ) : (
    <main className="panel-view">
      <div
        className="overview"
        style={{ position: 'sticky', height: '85%', top: 60, zIndex: 4 }}
      >
        {/* <h1 className="overview__heading">Profile</h1> */}
        <ProfileTab />
      </div>
    </main>
  );
}

export default React.memo(Profile);
