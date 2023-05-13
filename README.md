# Dalble

Personal WORDLE clone written in react and hosted in AWS.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Docker

You can use docker to build an image using the following command

```
docker build . -t jamesdalboth/dalble
```

And you can use docker to run a container using the following command

```
docker run -p 8080:8080 jamesdalboth/dalble
```

To publish docker images, first find the latest version, and tag the new image with an incremented value and latest

```
docker build . -f Dockerfile.prod -t jamesdalboth/dalble:latest -t jamesdalboth/dalble:<latest-version>
docker push jamesdalboth/dalble -a
```

## Terraform

We use terraform version 1.3.7. You can run `tfswitch 1.3.7`.

You can use `./scripts/plan.sh --version=<version>` to plan a deploy.

And you can use `./scripts/apply.sh --version=<version>` to apply a deploy (`--approve` for auto-approve)

## Pre-Commit
Once you have checked out the repo to your local machine, please install the git hooks for pre-commmit by running the following command:

```
pre-commit install
```

Also, install the pre-commit hook for conventional commits:

```
pre-commit install --hook-type commit-msg
```
