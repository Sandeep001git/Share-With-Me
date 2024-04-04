
export const asyncHandler=(fn)=>async(req,res,next)=>{
    try{
        await fn(req,res,next)   //runing asyncHanler function part not fn()
    }catch(error){
        res.send(error.code || 500)
        .json({
            success:false,
            message:error.message
        })
    }
}