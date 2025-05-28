/**
 * Custom Error Class: ValidationError
 * 
 * Represents an error that occur when validation fails
 * Inherits from the build-in error class.
 */
class validationError extends Error{
    constructor(message){
        //call the constructor of the parent class(Error)
        super(message);

        //Custom properties for the ValidationError
        this.code = 407;
        this.name = "ValidationError"//custom error name
    }
}
/**
 * Custom Error Class :InvalidUserError
 * 
 * Represent an error that occurs when dealing with an invalid user
 * Inherits from the built-in Error classs */
class InvalidUserError extends Error {
    constructor(message) {
        //Call the constructor of the parent class (error)
        super(message);

        //custom propertiew for the InvalidUserError
        this.code = 407;//custom error code
        this.name = "InvalidUserError"//customer error name
    }
}
/**
 * Custom Error Class :AuthenticationFailed
 * 
 * Represent an error that occurs when authentication fails
 * Inherits from the built-in Error class.
 */
class AuthenticationFailed extends Error{
    constructor(message){
        //call the constructor of the parent class
        super(message);
        //custom properties for the AuthenticationFailed Error
        this.code = 407;
        this.name = 'Authentication Failed';
        }
}
module.expports = {validationError,InvalidUserError,AuthenticationFailed};