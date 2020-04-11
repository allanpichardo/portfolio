import {StaticRouter} from "react-router-dom";
import { createReactAppExpress } from '@cra-express/core';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import App from "../src/App";

const path = require('path');
const React = require('react');

const clientBuildPath = path.resolve(__dirname, '../client');

function handleUniversalRender(req, res) {

  const helmetContext = {};

  const context = {};
  const el = (
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={req.url} context={context}>
          <App />
        </StaticRouter>
      </HelmetProvider>
  );

  if (context.url) {
    res.redirect(301, context.url);
    return;
  }

  return el;
}

const app = createReactAppExpress({
  clientBuildPath,
  universalRender: handleUniversalRender
});

if (module.hot) {
  module.hot.accept('../src/App', () => {
    App = require('../src/App').default;
    console.log('✅ Server hot reloaded App');
  });
}

export default app;
