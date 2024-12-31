class ApiError extends Error {
    message!: string; // Use `!` to assert that the property will be initialized in the constructor
    status!: number;  // Similarly for the `status` property
  
    constructor(message: string, status: number) {
      super(message);
      this.name = this.constructor.name;
      this.status = status;
  
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }

  export default ApiError;