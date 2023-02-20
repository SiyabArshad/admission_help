import{Router,Request,Response} from "express"
import { Signupfunc,Loginfunc, Forgotfunc, Newpassfunc, Loginwithgoogle, Loginwithgooglefailed } from "../controller/Authentication"
const route=Router()
route.post("/signup",Signupfunc)
route.post("/login",Loginfunc)
route.post("/forgotpass",Forgotfunc)
route.post("/newpass",Newpassfunc)
route.get("/gooleauth",Loginwithgoogle)
route.get("/loginfailed",Loginwithgooglefailed)
export default route