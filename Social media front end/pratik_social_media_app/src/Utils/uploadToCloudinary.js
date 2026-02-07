import { cloud_name } from "../config/constant";//create a constant.js and add the cloud_name of your cloudinary api name eg- drs66ygb9
const upload_preset="social-media-project"

export const uploadToCloudinary=async(pics,fileType)=>{
    if(pics && fileType){
        const data=new FormData();
        data.append("file",pics)
        data.append("upload_preset",upload_preset)
        data.append("cloud_name",cloud_name)

        const res=await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/${fileType}/upload`
            ,{method:"post",body:data}
        );
        
        const fileData=await res.json()
         console.log("res ----",fileData.url);
        return fileData.url;
    }else{
        console.log("Error...");
    }
}
