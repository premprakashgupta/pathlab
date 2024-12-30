import jwt from 'jsonwebtoken'
import { payload } from './interfaces';
import TokenModel from '../models/token.model';
import { Types } from 'mongoose';
export const generateToken=(payload:payload)=>{
    return jwt.sign({ id: payload.id }, process.env.JWT_TOKEN_SEC as string, { expiresIn: 60 * 60 });
}

export const tokenDeleteAndInsert=async(loginDetail:Types.ObjectId,loginAgent:string,token:string,deviceId:string)=>{
    // Remove existing tokens for this user and login agent
    await TokenModel.deleteMany({ loginDetail, loginAgent });
  
    // Create a new token record in the database
    await TokenModel.create({ loginDetail, loginAgent, token, deviceId });
}
export const generateUUID=()=> {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
          v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Check if a deviceId already exists in the cookies
export const getDeviceId=()=> {
    let deviceId = getCookie('deviceId');
    if (!deviceId) {
      deviceId = generateUUID();  // Generate new device ID if not found
      document.cookie = `deviceId=${deviceId}; path=/;`;
    }
    return deviceId;
  }
  
  // Function to get a cookie by name
  export const getCookie=(name:string)=> {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }
