const axios = require('axios');
const { nanoid } = require("nanoid");

const {
    statusCode,
    returnErrorJsonResponse,
    returnJsonResponse,
  } = require("../Helpers/status.js");


exports.shortUrl = async (req,res) =>{
    try {

        let base_url = process.env.BASE_URL || 'http://localhost:3000/'
        let {id, url} = req.body;

        if(id == undefined || id == null){
            id = nanoid()
        }
        if(!url){
            res.status(statusCode.nocontent).send("Please enter a URL");
        }

       
        const checkSlug = await axios({
            method: 'get',
            url: `https://urlshortnerr.hasura.app/api/rest/url/${id}`,
            headers: {
                'Content-Type': 'application/json',
                'x-hasura-admin-secret': process.env.HASURA_TOKEN
            }
        })

        if(checkSlug.data.urls.length != 0){
            return res
            .status(statusCode.bad)
            .json(
              returnErrorJsonResponse(
                statusCode.bad,
                "fail",
                "Shortned url with such ID already exist, Kindly use another ID"
              )
            );            
        }

        const result = await axios({
            method: 'post',
            url: 'https://urlshortnerr.hasura.app/api/rest/url/short',
            data: {
                slug: id,
                url: url
            },
            headers: {
                'Content-Type': 'application/json',
                'x-hasura-admin-secret': process.env.HASURA_TOKEN
            }
        });

        if(result.data){
            return res.status(statusCode.created)
            .json(
                returnJsonResponse(
                    statusCode.success,
                    'success',
                    `Shortned the URL ${url} to ${base_url + id}`,
                    result.data.insert_urls.returning[0].id
                )
            )
        }
                
    } catch (error) {
        return res
        .status(statusCode.bad)
        .json(
          returnErrorJsonResponse(
            statusCode.bad,
            "fail",
            "Something went wrong, Please try again. Check internet connection",
            error
          )
        );        
    }
    
}


exports.getAllUrl = async (req,res) => {
    try {
        const getAll = await axios({
            method: 'get',
            url: `https://urlshortnerr.hasura.app/api/rest/get-all-url`,
            headers: {
                'Content-Type': 'application/json',
                'x-hasura-admin-secret': process.env.HASURA_TOKEN
            }
        })
        
        if(getAll.data){
            return res.status(statusCode.created)
            .json(
                returnJsonResponse(
                    statusCode.success,
                    'success',
                    `Available URLs`,
                    getAll.data
                )
            )
        }
    } catch (error) {
        return res
        .status(statusCode.bad)
        .json(
          returnErrorJsonResponse(
            statusCode.bad,
            "fail",
            "Something went wrong, Couldnt fetch URLs",
            error
          )
        );        
    }        
}


exports.redirect = async(req,res) => {
    try {
        const { slug:id } = req.params;
        const getURL = await axios({
            method: 'get',
            url: `https://urlshortnerr.hasura.app/api/rest/url/${id}`,
            headers: {
                'Content-Type': 'application/json',
                'x-hasura-admin-secret': process.env.HASURA_TOKEN
            }
        })

        if(getURL.data.urls.length !=0) {
            const url = getURL.data.urls[0].url;
            return res.redirect(url);
        }else{
            return res
            .status(statusCode.bad)
            .json(
              returnErrorJsonResponse(
                statusCode.bad,
                "fail",
                "Something went wrong, Couldnt fetch URL",
                error
              )
            );
        }

    } catch (error) {
        return res
        .status(statusCode.bad)
        .json(
          returnErrorJsonResponse(
            statusCode.bad,
            "fail",
            "Something went wrong",
            error
          )
        );
    }
}