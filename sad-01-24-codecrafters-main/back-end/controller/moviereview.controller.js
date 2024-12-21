const MovieReview = require('../models/MovieReview');



exports.get = (req, res) => {
    MovieReview.find({movieId:req.params.id}, (err, datas)=>{
        if(err) return res.status(500).json({'status': false, 'errors': err})
        res.status(200).json({'status': true, 'datas': (datas)?datas: 'No datas found'})
    })
}

exports.get_all = async(req, res) => {

    let limit = 20 
    let {page} = req.query
    let skip = 0

    if(!page || page == 1){
        skip = 0
    }else{
        skip = (page - 1) * limit
    }
   
    let total = await MovieReview.find({}).count()

    MovieReview.find({...req.params.id?{_id: req.params.id}: ''})
    .populate('movieId')
    .skip(skip)
    .limit(limit)
    .exec((err, datas)=>{
        if(err) return res.status(500).json({'status': false, 'errors': err})
        res.status(200).json({'status': true, 'datas': datas,'pagination':{skip,limit,total}})
    })

   
}

exports.create = (req, res) => {
    MovieReview.create(req.body, (err, data)=>{
        if(err) return res.status(422).json({'status': false, 'errors': err})
        res.status(201).json({'status': true, 'datas': data})
    })
}

exports.update = async(req, res) => {
    return await MovieReview.findByIdAndUpdate(req.params.id,{...req.body},(err,data)=>{
        err && res.status(403).send({status:false,err:err})
        data && res.status(200).send({status:true,data:'Updated Successfully'})
  }).clone()
}

exports.delete = async(req, res) => {
    return await MovieReview.findByIdAndDelete(req.params.id,(err,data)=>{
          err && res.status(403).send({status:false,err:err})
          data && res.status(200).send({status:true,data:'Deleted Successfully'})
    }).clone()
}
