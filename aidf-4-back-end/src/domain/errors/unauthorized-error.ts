class unauthorizedError extends Error {
    constructor(message:string){
        super(message);
        this.name = "UnauthorizedError";
    }
}
export default unauthorizedError;