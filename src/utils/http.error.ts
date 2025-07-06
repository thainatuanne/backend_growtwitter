export class HTTPError extends Error {
    constructor(public statusCode: number, messageError: string ) {
        super(messageError);
    }
}