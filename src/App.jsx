import { Fragment, useEffect, useState } from 'react';
import Carousel from './components/Carousel';

import io from 'socket.io-client';

const socket = io('/', {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 100,
});

const defaultConfig = {
  files: [],
  config: { refreshMiliseconds: 3000 },
};

const App = () => {
  const [hydrated, setHydrated] = useState(false);
  const [data, setData] = useState(defaultConfig);

  const fetchServerData = async () => {
    setData(defaultConfig);
    console.log('fetching...');
    // http://localhost:5173/?directory=binipreu-menorca&orientation=vertical
    await fetch(`server/images${location.search}`)
      .then((res) => res.json())
      .then((res) => setData(res));
  };

  // Refresco via sockets (Cuando el server detecta cambios en la carpeta envía un socket)
  useEffect(() => {
    const onConnected = () => fetchServerData();
    const onRefreshed = () => fetchServerData();

    socket.on('connect', onConnected);
    socket.on('refresh', onRefreshed);
    setHydrated(true);

    return () => {
      socket.off('connect', onConnected);
      socket.off('refresh', onRefreshed);
    };
  }, [data]);

  if (!hydrated || data.files.length === 0) {
    // prevents client/server content desync
    return (
      <div style={LoadingContainer}>
        <div style={{ width: '450px', height: '350px' }}>
          <img
            title="loading"
            src="/loading.gif"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <Carousel images={data.files} interval={data.config.refreshMiliseconds} />
    </Fragment>
  );
};

const LoadingContainer = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
};

export default App;
