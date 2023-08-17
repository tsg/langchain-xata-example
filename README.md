# Langchain.js with Xata example

Boilerplate to get started quickly with the [Langchain Typescript SDK](https://github.com/hwchase17/langchainjs) and [Xata](https://xata.io), based on https://github.com/domeccleston/langchain-ts-starter. 

# How to use

- Clone this repository
- `npm install`
- Sign up to [Xata.io](https://app.xata.io)
- Create a Xata DB and initialize the repo for it like this:
```sh
 xata init --schema=schema.json --codegen=src/xata.ts
```
- Add the `OPENAI_API_KEY` env to `.env`
- Run the example with `npm start`
- Modify the code in `src/index.ts`
