 /*  //this road is an alternative if its more effcieint to stock buffer than path

   async createBufferRegister(req, res, next) {
    //convert req.files.picture[0].buffer to base64

    if(req.files.picture){
    const picture = req.files.picture[0].buffer;
    //add picture and req.body to new object
    const userData = {...req.body, picture}
    const addedUser = await add (req, res, next, userData)
    res.status(200).json(addedUser)
    }else{

    const userData = req.body;
    debug("userdata", userData)
    const addedUser = await add (req, res, next, userData)
    //we send mail to client forconfirm subscription


   sendMail('api.test.apo@gmail.com', 'nouvelle notification', '3 personnes ont like votre post')
    res.status(200).json(addedUser)
    }
 }
*/
