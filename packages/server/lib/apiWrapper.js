/*
  Copyright 2020-2023 Lowdefy, Inc

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
import path from 'path';
import crypto from 'crypto';
import { createApiContext } from '@lowdefy/api';
import { getSecretsFromEnv } from '@lowdefy/node-utils';

import connections from '../build/plugins/connections.js';
import createLogger from './log/createLogger.js';
import fileCache from './fileCache.js';
import getServerSession from './auth/getServerSession.js';
import operators from '../build/plugins/operators/server.js';
import config from '../build/config.json';

function serverSidePropsWrapper(handler) {
  return async function wrappedHandler(req, res) {
    let logger = console;
    try {
      const traceId = crypto.randomUUID();
      logger = createLogger({ traceId });
      const session = await getServerSession({ req, res });
      // Important to give absolute path so Next can trace build files
      const context = createApiContext({
        buildDirectory: path.join(process.cwd(), 'build'),
        config,
        connections,
        fileCache,
        headers: req.headers,
        logger,
        operators,
        secrets: getSecretsFromEnv(),
        session,
      });
      const response = await handler({ context, req, res });
      return response;
    } catch (error) {
      // TODO: Improve (logError function)
      // TODO: Log cause
      logger.error(error);
      // TODO: What we do here?
      res.status(500).json({ name: error.name, message: error.message });
    }
  };
}

export default serverSidePropsWrapper;
