import { Request,Response,Router } from "express";
import axios from "axios";
const cheerio=require("cheerio")
import { Messagepass } from "../helpers/Messagepass";
import Data from "../models/Data";
import { scheduleajob } from "../helpers/jobscheduling";
export const scarpedata=async(req:Request,res:Response)=>{
    if(req.user.admin===true)
    {
        try {
            let programsoffered:any=[]
            const urlin:string=`${req.body.uniurl}`
            const {data}:any=await axios.get(urlin, { 
              headers: { "Accept-Encoding": "gzip,deflate,compress" } 
          });
            const $=cheerio.load(data)
            const titleinfo=$(".page-title h1").text()//geting name of university
            const poster=$(".post_thumb a img").attr("src")
            const lastdateapply=$(".post_content h3").filter((i,it)=>i===0).text()
            const programsinfo=$(".sc_list li a").each((index,item)=>{
              programsoffered.push($(item).text())
            })
            const uniname=$(".odd p a").text()
            const alreadydata=await Data.findOne({title:titleinfo})
            if(alreadydata)
            {
                const mn=new Messagepass('Data already present on the platform',400)
                return res.status(400).json(mn);       
            }
            else
            {

                let admisiondetails=new Data({
                    name:uniname,
                    title:titleinfo,  
                    programs:programsoffered,
                    lastdate:lastdateapply,
                    poster:poster
                })
                await admisiondetails.save()
                scheduleajob(uniname)
                const mn=new Messagepass('Generated data successfully',200)
                return res.status(200).json(mn);
            }
          }
          catch(e)
          {
            const mn=new Messagepass('Failed to Generate data',500)
            return res.status(500).json(mn);
          }
    }
    else
    {
        const mn=new Messagepass('You dont have admin access',403)
        return res.status(403).json(mn);
    }
}

export const getunisdata=async(req:Request,res:Response)=>{
        try{
                const datainfo=await Data.find()
                const mn:Messagepass=new Messagepass(datainfo,200)
                return res.status(200).json(mn);    
        }
        catch{
            const mn:Messagepass=new Messagepass('Sorry something went wrong',500)
            return res.status(500).json(mn);
        }
}

export const getsearchunisdata=async(req:Request,res:Response)=>{
    try{
        const { name}:any = req.query;
          const regx = new RegExp(name, 'i');
        const results = await Data.find({name:{ $regex:regx} }).exec();
        console.log(results)
        const mn:Messagepass=new Messagepass(results,200)
        return res.status(200).json(mn);
    }
    catch{
        const mn:Messagepass=new Messagepass('Sorry something went wrong',500)
        return res.status(500).json(mn);
    }
}