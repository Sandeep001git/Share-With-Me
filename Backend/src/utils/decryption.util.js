import fs from 'fs';
import path from "path";
import crypto, { Cipher } from 'crypto';
import zlib from 'zlib';
import AppendInitVect from "../conf/AppendInitVect.js";

const getCrptoKey=(password)=>{
    return crypto.createHash('sha256').update(password).digest()
}

const decryption=({file,password})=>{

    let initVect; //initVect it initial vector to use as key which remane same
    
    const readingStream=fs.createReadStream(file,{end:15})
    
    readingStream.on('data',(chunk)=>{
        initVect=chunk
    })
    
    readingStream.on('close',(chunk)=>{

        const chiperKey=getCrptoKey(password)
        const readingStream=fs.createReadStream(file,{start:16})
        const decipher=crypto.createDecipheriv('aes256',chiperKey,initVect)
        const unzip=zlib.createGunzip()
        const writingStream=fs.createWriteStream(file+".unenc")

        readingStream
        .pipe(decipher)
        .pipe(unzip)
        .pipe(writingStream)
    })
}

export default decryption