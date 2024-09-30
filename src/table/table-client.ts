import EventEmitter from "events";
import {TableSessionPool} from "./table-session-pool";

import {TableSession} from "./table-session";
import {Context, ensureContext} from "../context";
import {IClientSettings} from "../client/settings";

/**
 * Version settings for service clients that are created by the discovery service method - one per endpoint. Like Topic client.
 */

export class TableClient extends EventEmitter {
    private pool: TableSessionPool;

    constructor(settings: IClientSettings) {
        super();
        this.pool = new TableSessionPool(settings);
    }

    // @ts-ignore
    public async withSession<T>(callback: (session: TableSession) => Promise<T>, timeout?: number): Promise<T>;
    public async withSession<T>(ctx: Context, callback: (session: TableSession) => Promise<T>, timeout?: number): Promise<T>;
        @ensureContext(true)
    public async withSession<T>(ctx: Context, callback: (session: TableSession) => Promise<T>, timeout: number = 0): Promise<T> {
        return this.pool.withSession(ctx, callback, timeout);
    }

    // @ts-ignore
    public async withSessionRetry<T>(callback: (session: TableSession) => Promise<T>, timeout?: number, maxRetries?: number): Promise<T>;
    public async withSessionRetry<T>(ctx: Context, callback: (session: TableSession) => Promise<T>, timeout?: number, maxRetries?: number): Promise<T>;
    @ensureContext(true)
    public async withSessionRetry<T>(ctx: Context, callback: (session: TableSession) => Promise<T>, timeout: number = 0, maxRetries = 10): Promise<T> {
        return this.pool.withSessionRetry(ctx, callback, timeout, maxRetries);
    }

    // @ts-ignore
    public async destroy(): Promise<void>;
    public async destroy(ctx: Context): Promise<void>;
    @ensureContext(true)
    public async destroy(ctx: Context): Promise<void> {
        await this.pool.destroy(ctx);
    }
}
