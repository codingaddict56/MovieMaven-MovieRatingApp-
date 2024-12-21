const Movie = require('../models/Movie');



exports.get = async (req, res) => {

    let limit = 20 
    let {page} = req.query
    let skip = 0

    if(!page || page == 1){
        skip = 0
    }else{
        skip = (page - 1) * limit
    }
   
    let total = await Movie.find({}).count()

    Movie.find({...req.params.id?{_id: req.params.id}: ''})
    .skip(skip)
    .limit(limit)
    .exec((err, datas)=>{
        if(err) return res.status(500).json({'status': false, 'errors': err})
        res.status(200).json({'status': true, 'datas': datas,'pagination':{skip,limit,total}})
    })
}

exports.search = async (req, res) => {

    let limit = 20 
    let {text,page} = req.query
    let params = {}
    let skip = 0

    params={$or: [
        { title: new RegExp(text, 'i') },
        { movieId: new RegExp(text, 'i') },
        { genre: new RegExp(text, 'i') },
        { synopsis: new RegExp(text, 'i') },
        { description: new RegExp(text, 'i') }
      ]
    }
    
   
    let total = await Movie.find(params).count()

    if(!page || page == 1){
        skip = 0
    }else{
        skip = (page - 1) * limit
    }
   

    Movie.find(params)
    .skip(skip)
    .limit(limit)
    .exec((err, datas)=>{
        if(err) return res.status(500).json({'status': false, 'errors': err})
        res.status(200).json({'status': true, 'datas': datas,'pagination':{skip,limit,total}})
    })
}


exports.get_all = async (req, res) => {
    Movie.find({})
    .exec((err, datas)=>{
        if(err) return res.status(500).json({'status': false, 'errors': err})
        res.status(200).json({'status': true, 'datas': datas})
    })
}

exports.create = async (req, res) => {
   await Movie.create(req.body, (err, data)=>{
        if(err) return res.status(422).json({'status': false, 'errors': err})
        res.status(201).json({'status': true, 'datas': data})
    })
}

exports.update = async(req, res) => {
    return await Movie.findByIdAndUpdate(req.params.id,{...req.body},(err,data)=>{
        err && res.status(403).send({status:false,err:err})
        data && res.status(200).send({status:true,data:'Updated Successfully'})
  }).clone()
}

exports.delete = async(req, res) => {
    return await Movie.findByIdAndDelete(req.params.id,(err,data)=>{
          err && res.status(403).send({status:false,err:err})
          data && res.status(200).send({status:true,data:'Deleted Successfully'})
    }).clone()
}

exports.upload_file = (upload,multer)=>{
    return (req, res) => {
        upload(req, res, (err)=>{
            if(err) return res.status(500).json({'status': false, 'errors': err})
                if(!req.file) return res.status(422).json({'status': false, 'errors': 'No image selected'})
                if (req.fileValidationError) {
                    return res.status(422).json({'status': false, 'errors': req.fileValidationError})
                }
                else if (err instanceof multer.MulterError || err) {
                    return res.status(500).json({'status': false, 'errors': err})
                }

                let file = req.file.path.includes("public\\")?req.file.path.split('public\\')[1].replace(/\\/gi,'/'):req.file.path.split('public/')[1]
                console.log("file",file)
                return res.status(200).send({status:true,data:file})

        })
    }    
}
