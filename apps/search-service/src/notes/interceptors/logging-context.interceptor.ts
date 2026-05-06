import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ClsService } from 'nestjs-cls';
import { Observable } from 'rxjs';

@Injectable()
export class LoggingContextInterceptor implements NestInterceptor {
    constructor(private readonly cls: ClsService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        if (context.getType() !== 'rpc') return next.handle();

        const rpcData = context.switchToRpc().getData();
        const rpcCtx = context.switchToRpc().getContext();

        const traceId =
            rpcData?.traceId ??
            rpcCtx?.getMessage?.().properties?.headers?.traceId ??
            randomUUID();

        return this.cls.runWith({}, () => {
            this.cls.set('traceId', traceId);
            return next.handle();
        });
    }
}
