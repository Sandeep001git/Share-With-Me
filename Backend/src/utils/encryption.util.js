import fs from 'fs';
import path from "path";
import crypto, { Cipher } from 'crypto';
import zlib from 'zlib';
import AppendInitVect from "../conf/AppendInitVect.js";

const getCrptoKey=(password)=>{
    return crypto.createHash('sha256').update(password).digest()
}

const encryption = ({file,password})=>{

    const initVect=crypto.randomBytes(16)
    const chiperKey=getCrptoKey(password)

    const readingStream=fs.createReadStream(file)
    const gzlib=zlib.createGzip()
    const cipher=crypto.createCipheriv('aes256',chiperKey,initVect)
    const appendInitVect= new AppendInitVect(initVect)
    const writingStream=fs.createWriteStream(path.join(file+".enc"))

    readingStream
    .pipe(gzlib)
    .pipe(cipher)
    .pipe(appendInitVect)
    .pipe(writingStream)
}

export default encryption