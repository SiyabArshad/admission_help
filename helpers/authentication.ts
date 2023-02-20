import{Router,Request,Response} from "express"
import jwt from "jsonwebtoken"
import { Messagepass } from "./Messagepass";
// Middleware to authenticate JWT token
export function authenticate(req: Request, res: Response, next: Function) {
    const authHeader = req.body.token || req.query.token || req.headers["token"]||req.cookies.admissionhelp;;
    if (authHeader) {
      const token = authHeader
      jwt.verify(token, process.env.JWT_SECRET, (err:any, user:any) => {
        if (err){
        const mn=new Messagepass('token not valid.',403)
        return res.status(403).json(mn);
        }
        req.user = user;
        next();
      });
    } else {
        const mn=new Messagepass('You are not authenticated.',401)
        return res.status(401).json(mn);
    }
  };

  