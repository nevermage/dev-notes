export class NoteUpdatedPayloadDto {
    id: string;
    title: string | null;
    content: string | null;
    traceId?: string;
}
