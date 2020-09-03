# ASK Lowdb Persistence Adapter

An [Alexa Skills Kit](https://developer.amazon.com/en-US/alexa/alexa-skills-kit)
[persistence
adapter](https://developer.amazon.com/en-US/docs/alexa/alexa-skills-kit-sdk-for-nodejs/manage-attributes.html#persistenceadapter)
for [lowdb](https://github.com/typicode/lowdb).

## Why?

For deployed Alexa Skills, you should use a proper persistence layer (for example Amazon
S3 using the
[ask-sdk-s3-persistence-adapter](https://www.npmjs.com/package/ask-sdk-s3-persistence-adapter)),
but for local development S3 can be awkward to use. Using lowdb is great because it saves
the data locally making it easy to debug and work with.

## Installation

Install adapter:

```sh
npm i ask-lowdb-persistence-adapter
```

Install peer dependencies:

```sh
npm i lowdb
```

## Usage

Basic usage:

```js
const LowdbPersistenceAdapter = require("ask-lowdb-persistence-adapter");

// ...

const options = {
  // the name of the lowdb database, default value shown here
  dbName: "persistenceAttributes.db.json",
  // the name of the key to store persistence attributes under in the
  // database, default value shown here
  attributesKey: "persistenceAttributes",
};

Alexa.SkillBuilders.custom()
  .withPersistenceAdapter(new LowdbPersistenceAdapter(options))
  .addRequestHandlers(/* ... */)
  .lambda();
```

Since the primary purpose of this adapter is for use locally when a proper persistence
layer is unavailable, a nice pattern for creating your persistence adapter is to use a
factory. For example, if one wanted to use S3 when it was available and lowdb otherwise,
one could implement it like so:

```js
const LowdbPersistenceAdapter = require("ask-lowdb-persistence-adapter");
const S3PersistenceAdapter = require("ask-sdk-s3-persistence-adapter")
  .S3PersistenceAdapter;

class PersistenceAdapterFactory() {
  constructor(s3BucketName) {
    this.s3BucketName = s3BucketName;
  }

  createPersistenceAdapter() {
    if (this.s3BucketName) {
      return new S3PersistenceAdapter({
        bucketName: this.s3BucketName
      });
    } else {
      return new LowdbPersistenceAdapter();
    }
  }
}

// ...

const persistenceAdapterFactory = new PersistenceAdapterFactory(process.env.S3_PERSISTENCE_BUCKET);

Alexa.SkillBuilders.custom()
  .withPersistenceAdapter(persistenceAdapterFactory.createPersistenceAdapter())
  .addRequestHandlers(/* ... */)
  .lambda();
```
