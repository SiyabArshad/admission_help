import{Router,Request,Response} from "express"
const route=Router()
import { authenticate } from "../helpers/authentication"
import { getsearchunisdata, getunisdata, scarpedata } from "../controller/datacontroller"
route.post("/getdata",authenticate,scarpedata)
route.get("/getunisdata",authenticate,getunisdata)
route.get("/getsearchdata",authenticate,getsearchunisdata)
export default route