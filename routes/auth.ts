import{Router,Request,Response} from "express"
import { Signupfunc,Loginfunc, Forgotfunc, Newpassfunc, Loginwithgoogle, Loginwithgooglefailed, updatealerts, getprofile } from "../controller/Authentication"
import { authenticate } from "../helpers/authentication"
const route=Router()
route.post("/signup",Signupfunc)
route.post("/login",Loginfunc)
route.post("/forgotpass",Forgotfunc)
route.post("/newpass",Newpassfunc)
route.get("/gooleauth",Loginwithgoogle)
route.get("/loginfailed",Loginwithgooglefailed)
route.post("/updatealert",authenticate,updatealerts)
route.get("/profile",authenticate,getprofile)
export default route