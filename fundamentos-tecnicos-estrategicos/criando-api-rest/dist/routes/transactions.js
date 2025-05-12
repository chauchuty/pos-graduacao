"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/routes/transactions.ts
var transactions_exports = {};
__export(transactions_exports, {
  transactinsRoutes: () => transactinsRoutes
});
module.exports = __toCommonJS(transactions_exports);

// src/database.ts
var import_config = require("dotenv/config");
var import_knex = require("knex");

// src/env/index.ts
var import_dotenv = require("dotenv");
var import_zod = require("zod");
if (process.env.NODE_ENV === "test") {
  (0, import_dotenv.config)({ path: ".env.test" });
} else {
  (0, import_dotenv.config)();
}
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: import_zod.z.string(),
  HOST: import_zod.z.string().default("localhost"),
  PORT: import_zod.z.coerce.number().default(3e3)
});
var _env = envSchema.safeParse(process.env);
if (!_env.success) {
  console.error("Invalid environment variables", _env.error.format());
  throw new Error("Invalid environment variables");
}
var env = _env.data;

// src/database.ts
var config2 = {
  client: "sqlite3",
  connection: {
    filename: env.DATABASE_URL
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations"
  }
};
var db = (0, import_knex.knex)(config2);

// src/routes/transactions.ts
var import_crypto = require("crypto");
var import_zod2 = require("zod");

// src/middlewares/check-session-id-exists.ts
async function checkSessionIdExists(req, res) {
  const sessionId = req.cookies.sessionId;
  if (!sessionId) {
    return res.status(401).send({
      error: "Unauthorized"
    });
  }
}

// src/routes/transactions.ts
async function transactinsRoutes(app) {
  app.get("/", {
    preHandler: [checkSessionIdExists]
  }, async (req, res) => {
    const sessionId = req.cookies.sessionId;
    const transactions = await db("transactions").where("session_id", sessionId).select();
    return {
      transactions,
      total: transactions.length
    };
  });
  app.get("/:id", {
    preHandler: [checkSessionIdExists]
  }, async (req) => {
    const sessionId = req.cookies.sessionId;
    const getTransactionParams = import_zod2.z.object({
      id: import_zod2.z.string().uuid()
    });
    const { id } = getTransactionParams.parse(req.params);
    const transaction = await db("transactions").where({
      session_id: sessionId,
      id
    }).first();
    return {
      transaction
    };
  });
  app.get("/summary", {
    preHandler: [checkSessionIdExists]
  }, async (req, res) => {
    const sessionId = req.cookies.sessionId;
    const summary = await db("transactions").where("session_id", sessionId).sum("amount", { as: "amount" }).first();
    return {
      summary
    };
  });
  app.post("/", async (req, res) => {
    const createTransactionBody = import_zod2.z.object({
      title: import_zod2.z.string(),
      amount: import_zod2.z.coerce.number(),
      type: import_zod2.z.enum(["credit", "debit"])
    });
    const { title, amount, type } = createTransactionBody.parse(req.body);
    let sessionId = req.cookies.sessionId;
    console.log(sessionId);
    if (!sessionId) {
      sessionId = (0, import_crypto.randomUUID)();
      res.cookie("sessionId", sessionId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7
        // 7 days
      });
    }
    await db("transactions").insert({
      id: (0, import_crypto.randomUUID)(),
      title,
      amount: type === "credit" ? amount : amount * -1,
      session_id: sessionId
    });
    return res.status(201).send("Transa\xE7\xE3o criada com sucesso");
  });
  app.delete("/:id", async (req, res) => {
    const getTransactionParams = import_zod2.z.object({
      id: import_zod2.z.string().uuid()
    });
    const { id } = getTransactionParams.parse(req.params);
    await db("transactions").where("id", id).delete();
    return res.status(204).send("Transa\xE7\xE3o deletada com sucesso");
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  transactinsRoutes
});
