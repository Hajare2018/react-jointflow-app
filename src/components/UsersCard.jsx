import { Card, CardContent, CardHeader, CardMedia, Radio } from '@mui/material';
import { AlternateEmailOutlined } from '@mui/icons-material';
import React from 'react';
import { FaUserShield } from 'react-icons/fa';
import { createImageFromInitials, getDevice } from './Utils';

export default function UsersCard({ user, selected, onSelect }) {
  const isItemSelected = selected(user?.id);
  const isMobile = getDevice();
  return (
    <div style={{ padding: 8 }}>
      <Card style={{ borderRadius: 8 }}>
        <CardContent style={{ padding: 0 }}>
          <CardHeader
            style={{ padding: 0 }}
            title={
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 0,
                }}
              >
                <div style={{ flex: 2 }}>
                  <CardMedia
                    component="img"
                    style={{ width: 80, height: '100%' }}
                    image={
                      user?.avatar
                        ? user?.avatar
                        : user?.avatar === null
                          ? createImageFromInitials(
                              300,
                              user?.first_name + ' ' + user?.last_name,
                              '#627daf',
                            )
                          : createImageFromInitials(
                              300,
                              user?.first_name + ' ' + user?.last_name,
                              '#627daf',
                            )
                    }
                    alt="jointflows user"
                  />
                </div>
                <div style={{ flex: 7, marginLeft: 10 }}>
                  <p style={{ fontWeight: '700' }}>{user?.first_name + ' ' + user?.last_name}</p>
                  <p style={{ display: 'flex', alignItems: 'center' }}>
                    <AlternateEmailOutlined
                      style={{
                        color: '#627daf',
                        width: 18,
                        height: 18,
                        marginRight: 8,
                      }}
                    />
                    {isMobile
                      ? user?.email?.length > 15
                        ? (user?.email).substring(0, 15 - 3) + '...'
                        : user?.email
                      : user?.email?.length >= 30
                        ? (user?.email).substring(0, 30 - 3) + '...'
                        : user?.email}
                  </p>
                  <p style={{ display: 'flex', alignItems: 'center' }}>
                    <FaUserShield
                      style={{
                        color: '#627daf',
                        width: 18,
                        height: 18,
                        marginRight: 8,
                      }}
                    />
                    {user?.role}
                  </p>
                </div>
                <div style={{ flex: 1, justifyContent: 'flex-end' }}>
                  <Radio
                    onClick={(_event) => {
                      onSelect(user);
                    }}
                    checked={isItemSelected}
                    color="default"
                  />
                </div>
              </div>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
