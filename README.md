# Code Streamer
[![nodemon](https://img.shields.io/badge/nodemon-2.0.7-76d04b?style=flat-square&logo=nodemon)](https://nodemon.io/)
[![eslint](https://img.shields.io/badge/eslint-7.28.0-4b32c3?style=flat-square&logo=eslint)](https://eslint.org/)
[![airbnb-style](https://flat.badgen.net/badge/style-guide/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://github.com/DiegoVictor/code-streamer/blob/master/LICENSE)

Study Case to learn about streaming video in Node.js

## Table of Contents
* [Requirements](#requirements)
* [Installing](#installing)
* [Usage](#usage)
  * [Choosing another videos](#choosing_another_videos)
    * [CODEC String](#codec-string)

# Requirements
* [Node.js](https://nodejs.org) ^15.14.0
* npm or [yarn](https://yarnpkg.com)
* [Git LFS](https://git-lfs.github.com/)

# Installing
After clone the repo, just install dependencies:
```shell
npm install
```
Or:
```shell
yarn
```

# Usage
First of all start up the server:
```shell
npm run dev:server
```
Or:
```shell
yarn dev:server
```

Then access through the browser the `http://localhost:3000` page (if you are using the default configuration), if everything is OK you should see the player loading and playing the video:

![Demo](https://raw.githubusercontent.com/DiegoVictor/code-streamer/main/screenshots/demo.gif)

## Choosing another videos
If you would like to choose another videos make sure to fragment them or the [Media Source Extensions](https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API) may not deal it properly.

* [Checking Fragmentation](https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API/Transcoding_assets_for_MSE#checking_fragmentation)
* [Fragmenting](https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API/Transcoding_assets_for_MSE#fragmenting)

Alternatively you can use [mp4fragment](http://www.bento4.com/documentation/mp4fragment/) from [Bento4](https://github.com/axiomatic-systems/Bento4) toolkit:
```
$ mp4fragment input.mp4 output.mp4
```

### CODEC String
To [add a Source Buffer to Media Source](https://developer.mozilla.org/en-US/docs/Web/API/MediaSource/addSourceBuffer) is necessary to set video's mimetype and codecs:
```
mediaSource.addSourceBuffer(
  'video/mp4; codecs="avc1.640028, mp4a.40.2"'
);
```
To retrieve this information you can also use the [Checking Fragmentation](https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API/Transcoding_assets_for_MSE#checking_fragmentation) page:

![codecs](https://raw.githubusercontent.com/DiegoVictor/code-streamer/main/screenshots/codecs.png)

Or use [mp4info](http://www.bento4.com/documentation/mp4info/) from [Bento4](https://github.com/axiomatic-systems/Bento4) toolkit:
```shell
$ mp4info big-buck.mp4 | grep Codec
  Codec String: mp4a.40.2
  Codec String: avc1.42E01E
```
