# Ediphy Editor
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/0264bdcdcdae4a198b59a57ca82168fa)](https://app.codacy.com/app/sonsoleslp/ediphy?utm_source=github.com&utm_medium=referral&utm_content=ging/ediphy&utm_campaign=Badge_Grade_Dashboard)
[![Build Status](https://travis-ci.org/ging/ediphy.svg?branch=master)](https://travis-ci.org/ging/ediphy)

**Ediphy Editor** is an open source e-learning authoring tool to create different types of resources (web documents, slides and more coming up soon).

This software is written in Javascript (ES6), making use of React and Redux.

## Installation and manual

Visit our wiki to see all the available Ediphy Editor instructions.

In order to install this project you will need `node` 8.x.x (latest), `yarn` and git.
First clone the repo and then install the dependencies like so:

```bash
git clone https://github.com/ging/ediphy.git
cd ediphy
yarn
yarn upgrade

```
Once everything is installed, you can run the application with the following line:

```bash
yarn start
```

## Code quality and documentation

We use ESDoc in order to generate our documentation.
To regenerate it after a change you need to run:

```bash
yarn run doc
```
We also make use of ESLint in order to guarantee a certain code quality. With the following line you will fix all the formatting errors and view those that can't be automatically fixed:

```bash
yarn run eslint
```

## Discussion and contribution

Feel free to raise an issue or send us a message at github.

## Copyright

Copyright 2016 Universidad Politécnica de Madrid

Ediphy is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

Ediphy Editor is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with Ediphy Editor. If not, see <http://www.gnu.org/licenses>.
