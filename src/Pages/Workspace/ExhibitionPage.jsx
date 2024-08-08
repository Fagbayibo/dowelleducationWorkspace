import dowellLogo from "../assets/images/dowell.png"
import npsScale from "../assets/images/nps-scale.png"
import QR from "../assets/images/QR.png"
import axios from "axios"
import { useState } from "react"
export default function ExhibitionPage(){
    const buttons=[0,1,2,3,4,5,6,7,8,9,10]
const[submitted,setSubmitted]=useState(-1)
    async function click(index){
        setSubmitted(index)   
        window.location.href=`https://100035.pythonanywhere.com/addons/create-response/v3/?user=True&scale_type=nps&channel=channel_1&instance=instance_1&workspace_id=6385c0e48eca0fb652c9447b&username=HeenaK&scale_id=665d95ae7ee426d671222a7b&item=${index}`
    }
    return(
        <div className=" h-full w-screen  relative pb-16 pt-5">
          
            <div className="w-full flex flex-col justify-center items-center  p-2 ">
                <img className="w-[100px]  " src="https://dowellfileuploader.uxlivinglab.online/hr/logo-2-min-min.png" alt="dowell logo"/>
               
            </div>
            <div  className="flex flex-col justify-center items-center p-2 mt-10 sm:mt-0 gap-8 ">
                <img src={npsScale} alt="nps-scale" className="w-[350px] sm:w-[450px]"/>
                <p className="font-bold text-red-500 sm:text-[25px] text-[18px] text-center">Would you recommend our product/service to your friends and colleagues?</p>
                <p className="sm:text-[18px] text-[14px]">Tell us what you think using the scale below!</p>
            </div>
           
                 <div className="flex justify-center items-center gap-1 md:gap-3 mt-12 sm:m-5">
                    <style>
                        {`
                       @keyframes spin {
                        to {
                          transform: rotate(360deg);
                        }
                      }
                      
                      .loader {
                        display: inline-block;
                        width: 20px;
                        height: 20px;
                        border: 3px solid rgba(255, 255, 255, 0.3);
                        border-radius: 50%;
                        border-top-color: #fff;
                        animation: spin 1s linear infinite;
                      }
                      
                      
                          
                        `}
                    </style>
                 {buttons.map((button,index)=>(
              <button
              key={index}
              className={`sm:px-5 sm:p-2 p-[2px] px-[8px] rounded-full font-bold text-[14px] md:text-[20px]
                hover:bg-blue-600 ${submitted==index ? "bg-blue-600 text-white flex justify-center items-center p-[1px] px-[4px]" : "bg-[#ffa3a3]"}`}
              onClick={() => { click(index); }}
            >
              {submitted==index ? <div className="loader"></div> : button}
            </button>
            
              
                ))}
             </div>
     
            {/* <div className=" absolute bottom-15 right-[27%] sm:right-[45%] md:mt-10 flex flex-col justify-center items-center"> */}
             
                <p className="w-full absolute bottom-0 mt-4 flex justify-center items-center text-[12px] sm:text-[14px]">Powered by uxlivinglab</p>
               
                
            {/* </div> */}
           
          
        </div>
    )
}