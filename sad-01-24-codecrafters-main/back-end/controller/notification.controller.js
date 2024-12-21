const Notification = require('../models/Notification');



exports.get = (req, res) => {
    Notification.find({movieId:req.params.id}, (err, datas)=>{
        if(err) return res.status(500).json({'status': false, 'errors': err})
        res.status(200).json({'status': true, 'datas': (datas)?datas: 'No datas found'})
    })
}

exports.create = (req, res) => {
    Notification.create(req.body, (err, data)=>{
        if(err) return res.status(422).json({'status': false, 'errors': err})
        res.status(201).json({'status': true, 'datas': data})
    })
}

exports.update = async(req, res) => {
    return await Notification.findByIdAndUpdate(req.params.id,{...req.body},(err,data)=>{
        err && res.status(403).send({status:false,err:err})
        data && res.status(200).send({status:true,data:'Updated Successfully'})
  }).clone()
}

exports.delete = async(req, res) => {
    return await Notification.findByIdAndDelete(req.params.id,(err,data)=>{
          err && res.status(403).send({status:false,err:err})
          data && res.status(200).send({status:true,data:'Deleted Successfully'})
    }).clone()
}
