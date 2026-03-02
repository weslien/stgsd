import { Identity } from 'spacetimedb';
import {
  DbConnection,
  type ErrorContext,
  type EventContext,
  tables,
} from './module_bindings/index.js';

const HOST = process.env.SPACETIMEDB_HOST ?? 'https://maincloud.spacetimedb.com';
const DB_NAME = process.env.SPACETIMEDB_DB_NAME ?? 'spacetimeclaude-gvhsi';

DbConnection.builder()
  .withUri(HOST)
  .withDatabaseName(DB_NAME)
  .onConnect((conn: DbConnection, identity: Identity, _token: string) => {
    console.log('Connected to SpacetimeDB!');
    console.log(`Identity: ${identity.toHexString().slice(0, 16)}...`);

    conn.db.project.onInsert((_ctx: EventContext, project) => {
      console.log(`New project: ${project.name}`);
    });

    conn
      .subscriptionBuilder()
      .subscribe(tables.project);
  })
  .onDisconnect(() => {
    console.log('Disconnected from SpacetimeDB');
  })
  .onConnectError((_ctx: ErrorContext, error: Error) => {
    console.error('Connection error:', error);
    process.exit(1);
  })
  .build();
