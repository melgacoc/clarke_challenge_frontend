import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import Routes  from '../src/routes/Routes.tsx';
import client from './services/apolloClient';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <Routes />
    </ApolloProvider>
  </StrictMode>
);
