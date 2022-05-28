## Installation

Using NPM

```bash
  npm i @orjdev/mysqm
```

### initialize

```js
import mySQM from "@orjdev/mysqm";

let client = new mySQM.Client({
  port: 3306,
  user: "",
  password: "1234567",
  host: "localhost",
  database: "",
});
```

### You Can Use Custom Types Too

```typescript
type IExpectedResults = { id: number; username: string };
let userModel = client.useModel("users");
```

### Event Listener

```typescript
type IEvents =
  | "connected"
  | "disconnected"
  | "result"
  | "error"
  | "end"
  | "fields"
  | "packet";
client.on("connected", () => console.log("connected"));
```

### Get One

```typescript
let query = {
  where: {
    id: {
      eq: 1,
    },
  },
};
let resp = await userModel.findOne<IExpectedResults>(query);
```

### Get All

```typescript
let query = {
  where: {
    username: {
      eq: "test",
    },
  },
};
let resp = await userModel.findAll<IExpectedResults>(query);
```

### Update One

```typescript
let query = { where: { id: { eq: 1 } } };
let newFields = {
  username: {
    default: "newUsername",
  },
  perms: {
    special: JSON.stringify({ test: true }),
  },
};
let resp = await userModel.updateOne(query, newFields);
```

### Delete

```typescript
let query = { where: { id: { eq: 1 } } };
let resp = await userModel.delete(query);
```

### Create One

```typescript
let newFields = { username: { default: "test" } };
let resp = await userModel.createOne(newFields);
```
