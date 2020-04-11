import {StaticRouter} from "react-router-dom";
import { createReactAppExpress } from '@cra-express/core';
import ReactDOMServer from 'react-dom/server';
import App from "../src/App";

const path = require('path');
const React = require('react');

const clientBuildPath = path.resolve(__dirname, '../client');

function handleUniversalRender(req, res) {

  const context = {};
  const el = (
      <StaticRouter location={req.url} context={context}>
        <App />
      </StaticRouter>
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
