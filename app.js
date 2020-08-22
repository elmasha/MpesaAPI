const express = require('express')
const request = require('request')
const bodyParser = require('body-parser');
const e = require('express');
const http = require('http');
const https = require('https');
const app = express();
const apiCallFromRequest = require('./Request')
const apiCallFromNode = require('./nodeCalls')

const port = app.listen(process.env.PORT || 3000);
const urlE = express.urlencoded({ extended: false })
app.use(express.json())


//routes
app.get('/', (req, res)=>{


res.send("Hello Mkoba App Elmasha Mpesa APi")


})




///----Access Token ---
app.get('/access_token',access,(req,res)=>{

    res.status(200).json({access_token: req.access_token})

})

///----Stk Push ---//
app.post('/stk', access, urlE ,function(req,res){

    let endpoint = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
    let auth = "Bearer "+ req.access_token

    let _shortCode = '174379';
    let _passKey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'
    let _amout = req.body.Amount
    let _phoneNumber = req.body.PhoneNumber
      
    const timeStamp = (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${_shortCode}${_passKey}${timeStamp}`).toString('base64');

    request(
        {
            url:endpoint,
            method:"POST",
            headers:{

                "Authorization": auth
                
            },
    
        json:{
    
                    "BusinessShortCode": "174379",
                    "Password": password,
                    "Timestamp": timeStamp,
                    "TransactionType": "CustomerPayBillOnline",
                    "Amount": "1",
                    "PartyA": "254746291229",
                    "PartyB": "174379",
                    "PhoneNumber": _phoneNumber,
                    "CallBackURL": "https://mpesamko.herokuapp.com/stk_callback",
                    "AccountReference": " Elmasha TEST",
                    "TransactionDesc": "Lipa na Mpesa"

            }

        },
       function(error,response,body){

            if(error){

                console.log(error);

            }else{

                res.status(200).json(body)
                res.send(body)
                console.log(body)
        
            }
               

        })

});

//-----Callback Url ----///
app.post('/stk_callback',function(res,req){
    
    console.log('.......... STK Callback ..................');
    console.log(req.body);
    res.send("",req.body);

    })






///----STK QUERY ---
app.post('/stk/query',access,(req,res)=>{

    checkoutRequestId='ws_CO_180820201459553317'

    auth = "Bearer "+ req.access_token

    let endpoint ='https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query'
    const _shortCode = '174379'
    const _passKey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'
    const timeStamp = (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -3)
    const password = Buffer.from(`${_shortCode}${_passKey}${timeStamp}`).toString('base64')
    

    request(
        {
            url:endpoint,
            method:"POST",
            headers:{
                "Authorization": auth
            },
           
        json:{
    
            'BusinessShortCode': _shortCode,
            'Password': password,
            'Timestamp': timeStamp,
            'CheckoutRequestID': checkoutRequestId

            }

        },
        function(error,response,body){

            if(error){

                console.log(error);

            }else if(response == 404){

                console.log("Error Something went wrong..")


            }else{
                res.status(200).json(body)
                console.log(body)
            }

        })

})



app.post('/timeout_url', (req, resp) => {
    console.log('.......... Timeout ..................')
    console.log(req.body)
})

app.post('/result_url', (req, resp) => {
    console.log('.......... Results..................')
    console.log(req.body)
})




///-----B2c -----///
app.get('/b2c', access , (req,res)=>{


    let endpoint = "https://sandbox.safaricom.co.ke/mpesa/b2c/v1/processrequest"
    let auth = "Bearer "+ req.access_token

    request(
        {
            url:endpoint,
            method :"POST",
            headers:{
            "Authorization": auth
                
            },json:{
        
                "InitiatorName":"testapi481",
                "SecurityCredential":"IeLYriOxTaityG/uhB+74NIiZW8blxi5dC89CQRW2pliMYPb36n5E08NT+5fUXk60JHFNi5csrN9dFpE7zbswV9FHf3qhZuNEbuUt1ix6rPk7fIQXe3KQL1BOe0boYd4+nwcv283KzxJ+42A9WdH4j+5RlY7lTeGCzHztw1S1DHcUHGUIfsDHnff3DdjgNHGVlRVW3KuEzO/BfLLx8bDPxa4RNGoFaFaDPj6I235wrze0pZVtz9Nsxdu9ixzqD0boZClM5qX4SKwarsDAyPU09yi7OECPW0mwXs2CPUrychIHn8aTvN3ZxQBAHT1WqtIZsj92HAs9UCRm91AgyiO9A== ",
                "CommandID":"BusinessPayment",
                "Amount":"23",
                "PartyA":"600481",
                "PartyB":"254708374149",
                "Remarks":" Salary Payment",
                "QueueTimeOutURL":"https://mkoba.herokuapp.com/timeout_url",
                "ResultURL":"https://mkoba.herokuapp.com/result_url",
                "Occasion":"MpesaApi001 "

            }
        
        },
        function(error,response,body){
            if(error){
                console.log(error);
            }

                res.status(200).json(body)

        }
    )


})





//----Register Url ------///
app.get('/Register_urls',access,(res,req)=>{

    let endpoint = "http://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl"
    let auth = "Bearer "+ req.access_token

    request(
        {
            url:endpoint,
            method :"POST",
            headers :{
                "Authorization": auth
            },
            json:{
      "ShortCode":"600481",
      "ResponseType":"Complete",
      "ConfirmationURL":"http://ip_address:port/confirmation",
      "ValidationURL":"http://ip_address:port/validation_url"
            }
        },
        function(error,response,body){
            if(error) {console.log(error)
            }else{
            res.status(200).json(body)
            }
        }
    )



})






function access(res,req,next){

    const endpoint ="https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    const auth = new Buffer.from('K49Zle6LPHOGv7avuuw61MfIIWzai9gS:FQCGD4QOIFM4j8HJ').toString('base64');

    request(
    {
        url:endpoint,
        headers:{
            "Authorization": "Basic " + auth
        }

    },
    (error,response,body)=>{

        if(error){
            console.log(error);
        }else{
        
            res.access_token = JSON.parse(body).access_token
            next()
        
        }
            
    }
    )


}



//-- listen
app.listen(port,(error)=>{

if(error){
    


}else{  

    console.log(`Server running on port http://localhost:${port}`)

}


});