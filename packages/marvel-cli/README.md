# @bybit/marvel-cli
to maintain multi apps

## Quick start

Create your project directory：

```bash
mkdir marvel_project && cd marvel_project
```

Install:

```bash
yarn add @bybit/marvel-cli
```

Initialize:

```bash
npx marvel init
```

Ensure dependencies && Start your app：

```bash
yarn && yarn start
```

# Bybit Marvel

This set of projects is initialized with @bybit/marvel-cli. Follow is the quick guide for how to use.

## Environment Prepare

Install `node_modules`:

```bash
yarn
```

or

```bash
npm i
```

## Provided Scripts

@bybit/marvel-cli provides some useful script to help you quick start and build with web project, code style check and test.

Scripts provided in `package.json`. It's safe to modify or add additional script:

### Start project

```bash
yarn start
```

### Build project

```bash
yarn build
```

### Check code style

```bash
yarn lint
```

You can also use script to auto fix some lint error:

```bash
yarn lint:fix
```

### Test code

```bash
yarn test
```

## Generate new app

```bash
yarn generate
```

## Analyze bundle Size

```bash
yarn analyze
```

## More

You can view full document. And welcome any feedback in our [gitlab](https://git.bybit.com/fe/marvel-cli).
