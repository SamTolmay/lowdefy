/*
  Copyright 2020 Lowdefy, Inc

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

import { GoogleSpreadsheet } from 'google-spreadsheet';

async function getSheet({ connection }) {
  const { apiKey, client_email, private_key, sheetId, sheetIndex, spreadsheetId } = connection;
  const doc = new GoogleSpreadsheet(spreadsheetId);
  if (apiKey) {
    doc.useApiKey(apiKey);
  } else {
    await doc.useServiceAccountAuth({
      client_email: client_email,
      private_key: private_key,
    });
  }

  await doc.loadInfo();
  let sheet;
  if (sheetId) {
    sheet = doc.sheetsById[sheetId];
    if (!sheet) {
      throw new Error(`Could not find sheet with sheetId "${sheetId}"`);
    }
  } else {
    sheet = doc.sheetsByIndex[sheetIndex];
    if (!sheet) {
      throw new Error(`Could not find sheet with sheetIndex ${sheetIndex}`);
    }
  }
  return sheet;
}

export default getSheet;
