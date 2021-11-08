/*
  Copyright 2020-2021 Lowdefy, Inc

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

import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import writeFile from './writeFile.js';

const baseDir = path.resolve(process.cwd(), 'test/writeFile');

test('writeFile', async () => {
  const filePath = path.resolve(baseDir, 'writeFile.txt');
  try {
    fs.unlinkSync(filePath);
  } catch (error) {
    //pass
  }
  expect(fs.existsSync(filePath)).toBe(false);
  await writeFile({
    filePath,
    content: `Test Write File`,
  });
  const res = fs.readFileSync(filePath, 'utf8');
  expect(res).toEqual(`Test Write File`);
  try {
    fs.unlinkSync(filePath);
  } catch (error) {
    //pass
  }
});

test('writeFile should create directories if they do not exist', async () => {
  const filePath = path.resolve(baseDir, 'sub/dir/test/writeFile.txt');
  const testBaseDir = path.resolve(baseDir, 'sub');

  await new Promise((resolve) => rimraf(testBaseDir, resolve));

  expect(fs.existsSync(filePath)).toBe(false);
  await writeFile({
    filePath,
    content: `Test Write File`,
  });
  const res = fs.readFileSync(filePath, 'utf8');
  expect(res).toEqual(`Test Write File`);
  await new Promise((resolve) => rimraf(testBaseDir, resolve));
});

test('readFile error id filepath is not a string', async () => {
  await expect(writeFile({ filePath: true, content: `Test Write File` })).rejects.toThrow(
    'Could not write file, file path should be a string, received true.'
  );
});

test('readFile errors if path is not already resolved', async () => {
  await expect(
    writeFile({ filePath: './writeFile/writeFile.txt', content: `Test Write File` })
  ).rejects.toThrow(
    'Could not write file, file path was not resolved, received "./writeFile/writeFile.txt".'
  );
});
