import TransformStream from "stream"

class AppendInitVect extends TransformStream{

    constructor(initVect,opts){
        super(opts)
        this.initVit=initVect
        this.appended=false
    }

    _transform(chunk,encoding,cb){
        if(!this.appended){
            this.push(this.initVit)
            this.appended=true
        }
        this.push(chunk)
        cb()
    }
}
export default AppendInitVect