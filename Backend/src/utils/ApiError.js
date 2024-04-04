
class ApiResponse{

    constructor(
        statuscode,
        message="something goes wrong",
        errors=[],
        stack=''
    ){
        super(message),
        this.data=null
        this.statuscode=statuscode,
        this.errors=errors
        this.success=false

        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(this.this.constructor)
        }
    }
}
export  {ApiResponse}