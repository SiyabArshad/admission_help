enum tyeofmesage{
    pass='Success',
    fail='Failed'
}
export class Messagepass{
    message:string|Object
    responsetype:string
    constructor(mess:any,statuscode:number){
        this.message=mess
        if(statuscode!==200)
        {
            this.responsetype=tyeofmesage.fail
        }
        else
        {
            this.responsetype=tyeofmesage.pass
        }
    }
}