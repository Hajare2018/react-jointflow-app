import { useState, useEffect } from 'react';
import { Provider, Config } from '@cobaltio/react-cobalt-js';
import HttpClient from '../../Api/HttpClient';
import Loader from '../../components/Loader';

export default function IntegrationsPage() {
  const [sessionToken, setSessionToken] = useState(null);
  useEffect(() => {
    const fetchToken = async () => {
      const token = await HttpClient.getCobaltSessionToken();

      setSessionToken(token);
    };

    fetchToken();
  }, []);

  if (sessionToken === null) {
    return <Loader />;
  }

  return (
    <Provider sessionToken={sessionToken}>
      {
        // ideally you'd render the Config component inside a modal.
        // the component only gets rendered when `slug` is passed.
        <Config
          id="default" // Optional
          slug="jira" // application type / slug
          // dynamic labels payload (optional)
          labels={
            {
              /* PAYLOAD */
            }
          }
          // you can override the component's container style if you want
          style={{
            borderRadius: 8,
            maxWidth: 450,
          }}
        />
      }
    </Provider>
  );
}
