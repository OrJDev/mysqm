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
client.listen("connected", () => console.log("connected"));
```

### Get One

```typescript
let query = {
  where: {
    username: {
      eq: "test",
    },
  },
};
let resp = await userModel.findOne<IExpectedResults>(query);
```

### Get All

```typescript
let resp = await userModel.findAll<IExpectedResults>(query);
```

### Update One

```typescript
let query = { where: { id: { 'eq': 1 } } },
{
    username: {
        'default': 'newuuss'
    },
    perms: {
        'special': JSON.stringify({ test: true })
    }
}
  let resp = await userModel.updateOne(query)
```

### Delete

```typescript
let query = { where: { id: { eq: 1 } } };
let resp = await userModel.delete(query);
```

### Create One

```typescript
let query = { username: { default: "test" } };
let resp = await userModel.createOne(query);
```

## Expected Types

```typescript
interface IConfig {
  includeResponse?: boolean;
  includeQueries?: boolean;
  includeCount?: boolean;
}

interface IListener {
  type: IEvents;
  callback: ICallBack;
}
type ICallBack = (...args: any[]) => void;
type IEvents =
  | "connected"
  | "disconnected"
  | "result"
  | "error"
  | "end"
  | "fields"
  | "packet";

type IQueryType = "eq" | "bigger" | "smaller" | "neq" | "bigeq" | "smeq";
type IElementType<T> = T extends "bigger"
  ? number
  : T extends "smaller"
  ? number
  : T extends "eq"
  ? any
  : string;

interface IQuery {
  where?: {
    [name: string]: {
      [queryT in IQueryType]?: IElementType<queryT>;
    };
  };
}

type IResults<T> = {
  response?: any;
  queries?: {
    query: string;
    fields: any[];
  };
  count?: number;
  results: T;
  success: boolean;
};

interface IFields {
  [name: string]: {
    [fieldType in IOptionalFields]?: any;
  };
}

type IOptionalFields = "default" | "special";
```
