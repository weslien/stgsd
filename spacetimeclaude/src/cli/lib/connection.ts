import {
  DbConnection,
  type ErrorContext,
  type SubscriptionEventContext,
} from '../../module_bindings/index.js';
import { CliError, ErrorCodes } from './errors.js';

const SPACETIMEDB_URI = 'https://maincloud.spacetimedb.com';
const DATABASE_NAME = 'spacetimeclaude-gvhsi';

export async function withConnection<T>(
  fn: (conn: DbConnection) => T | Promise<T>,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(
        new CliError(
          ErrorCodes.CONNECTION_FAILED,
          'Connection timed out after 15 seconds',
        ),
      );
    }, 15_000);

    DbConnection.builder()
      .withUri(SPACETIMEDB_URI)
      .withDatabaseName(DATABASE_NAME)
      .onConnect((conn: DbConnection, _identity, _token) => {
        conn
          .subscriptionBuilder()
          .onApplied(async (_ctx: SubscriptionEventContext) => {
            try {
              const result = await fn(conn);
              clearTimeout(timeout);
              conn.disconnect();
              resolve(result);
            } catch (err) {
              clearTimeout(timeout);
              conn.disconnect();
              reject(err);
            }
          })
          .onError((ctx: ErrorContext) => {
            clearTimeout(timeout);
            conn.disconnect();
            reject(
              new CliError(
                ErrorCodes.CONNECTION_FAILED,
                `Subscription error: ${ctx.event}`,
              ),
            );
          })
          .subscribeToAllTables();
      })
      .onConnectError((_ctx: ErrorContext, err: Error) => {
        clearTimeout(timeout);
        reject(
          new CliError(
            ErrorCodes.CONNECTION_FAILED,
            `Connection failed: ${err.message}`,
          ),
        );
      })
      .build();
  });
}
