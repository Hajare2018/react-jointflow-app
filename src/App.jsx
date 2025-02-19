import React from 'react';
import './App.css';
import { Provider } from 'react-redux';
import store from './Redux/Store/store';
import Toast from './components/Toast';
import { createTheme, ThemeProvider } from '@mui/material';
import { StyledEngineProvider } from '@mui/material/styles';
import ErrorBoundary from './pages/ErrorBoundary';
import { TenantContextProvider } from './context/TenantContext';
import { UserContextProvider } from './context/UserContext';
import AppRoutes from './AppRoutes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider as MTThemeProvider } from '@material-tailwind/react';

const theme = createTheme({
  typography: {
    fontFamily: ['Poppins', 'sans-serif'].join(','),
  },
});

const mtTheme = {
  tooltip: {
    styles: {
      base: {
        bg: 'bg-slate-600/80',
      },
    },
  },
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <StyledEngineProvider injectFirst>
            <MTThemeProvider value={mtTheme}>
              <UserContextProvider>
                <TenantContextProvider>
                  <Toast />
                  <div className="h-full">
                    <ErrorBoundary>
                      <AppRoutes />
                      {process.env.REACT_APP_ENV !== 'production' && (
                        <ReactQueryDevtools buttonPosition="bottom-left" />
                      )}
                    </ErrorBoundary>
                  </div>
                </TenantContextProvider>
              </UserContextProvider>
            </MTThemeProvider>
          </StyledEngineProvider>
        </ThemeProvider>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
