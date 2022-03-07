# Simple Project managment app

## Prerequisites

- Dotnet 6.0 SDK

- Node.js version >16

## Building and running

Open bash or other "sh compatible": 

```
cd ./client/projectMng
npm install
npm run backend:build
```

Start backend:

```
cd ./client/projectMng
dotnet ./backend/Api.dll &
```

Start the client:

```
cd ./client/projectMng
npm electron
```