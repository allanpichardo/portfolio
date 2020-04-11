import {StaticRouter} from "react-router-dom";
import { createReactAppExpress } from '@cra-express/core';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import App from "../src/App";

const path = require('path');
const React = require('react');

const clientBuildPath = path.resolve(__dirname, '../client');

let helmetCtx;
const app = createReactAppExpress({
  clientBuildPath,
  universalRender: handleUniversalRender,
  onFinish(req, res, html) {
    const { helmet } = helmetCtx;
    const helmetTitle = helmet.title.toString();
    const helmetMeta = helmet.meta.toString();
    const newHtml = html
        .replace('{{HELMET_TITLE}}', helmetTitle)
        .replace('{{HELMET_META}}', helmetMeta);
    res.send(newHtml);
  },
});

function handleUniversalRender(req, res) {
  const context = {};
  helmetCtx = {};
  const el = (
      <HelmetProvider context={helmetCtx}>
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

if (module.hot) {
  module.hot.accept('../src/App', () => {
    App = require('../src/App').default;
    console.log('✅ Server hot reloaded App');
  });
}

export default app;
