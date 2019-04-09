
/** This file is about Collective CRUD, The code below of delete files were written by Bo**/

/** Collective CRUD **/
var Collective = require('../models/collective');

var util = require('../../../common/util');
var apiHelper = require('../../../common/apiHelper');
const axios = require('axios');


exports.getAll = function(req, res) {
	if (req.user.level == 1 || process.env.ISOPENTOALL) {
		apiHelper.getAllAndPopulate(Collective, req, res, [{path: 'createdBy', select: 'username'}, 'account']);
	} else {
		if(req.user.account != null) {
			apiHelper.getByPropertyNoneUniqueAndPopulate(Collective, {"account": req.user.account}, req, res, [{path: 'createdBy', select: 'username'}, 'account'])
		} else {
			res.status(500).json({returnCode: false, responseText: 'You do not have access for this.'});
		}
	}
};

// @Input req.params.id
exports.getById = function(req, res) {
	if (req.user.level == 1 || process.env.ISOPENTOALL) {
		apiHelper.getByIdAndPopulate(Collective, req, res, [{path: 'createdBy', select: 'username'}, 'account', 'mainLayer.interior', 'mainLayer.exterior']);
	} else {
		apiHelper.getByPropertyNoneUnique(Collective, {"account": req.user.account, "_id": req.params.id} , req, res, [{path: 'createdBy', select: 'username'},'account']);
	}
};

exports.create = function(req, res) {
    var collective = new Collective();
    collective.createdBy = req.user._id;
    
	if (req.user.level == 1 && req.body.account != null) {
		collective.account = req.body.account;
	} else {
		collective.account = req.user.account;
	}
    
	collective.name = req.body.name;
    collective.manufacturDate = req.body.manufacturDate;
    collective.loanStatus = req.body.loanStatus;
    collective.valuation = req.body.valuation;
	collective.purchaseInformation = req.body.purchaseInformation;
	collective.titleInsurance = req.body.titleInsurance;
	collective.serviceSchedule = req.body.serviceSchedule;
	collective.description = req.body.description;
	if (req.body.additionalInfo != null) {
		collective.additionalInfo = req.body.additionalInfo;
	}
	if (req.body.relatedItems != null) {
	collective.relatedItems = req.body.relatedItems;
	}
	
	if (req.body.status) {
		collective.status = req.body.status;
	}
	if(req.body.beaconLocations) {
		collective.beaconLocations = req.body.beaconLocations;
	}
	
	collective.save(function (err, createdCollective) {
        if (err) {
			console.log(err);
            res.status(500).send({
                returnCode: false,
                responseText: 'Error occurred while creating the collective object.'
            });
        } else {
            res.status(201).send({
                returnCode: true,
                responseText: createdCollective._id
            })
        }
    });
};

// Allows partial update
exports.update = function(req, res){
  if (req.user.level == 1) {
	// allow all fields
	apiHelper.partialUpdate(Collective, req, res, false);
  } else {
	res.status(500).json({returnCode: false, responseText: 'You do not have access for this.'});
  }
};

exports.remove = function(req, res){
  if (req.user.level == 1) {
	apiHelper.removeById(Collective, req, res);
  }else {
	res.status(500).json({returnCode: false, responseText: 'You do not have access for this.'});
  }
};

exports.removeCollectiveFiles = async function(req, res){
	if (req.user.level == 1) {
	
		collective = Collective.findOne({_id: req.params.id})
		console.log("remove collective files");
		console.log(req.params.id);
	  
		  try {
			collective = await collective.exec();
			console.log(collective);
		  }catch (err) {
			return response(res, err);
		  }	

			var filename1 = collective.multimediaFileRef;	

			var filename2 = []; 
			var filename3 = [];
			let galleryLength = collective.gallery.length;
			let serviceScheduleLength = collective.serviceSchedule.length;
			console.log(galleryLength);
			console.log(serviceScheduleLength);

			for(let i = 0 ;i < galleryLength; i++ ){
			   photo1 = collective.gallery[i].multimediaFileRef;
			   filename2.push(photo1); // add at the end 
			}
		
			for(let j = 0 ;j < serviceScheduleLength; j++ ){
				photo2 = collective.serviceSchedule[j].multimediaFileRef;
				filename3.push(photo2); // add at the end 
			 }

			 console.log(filename1);
			 console.log(filename2);
			 console.log(filename3);
			
			if(filename1 != null || filename2 != null || filename3 != null){
				axios.delete('http://localhost:3450/api/file/'+ filename1,	
				{data: {filename:filename1}, 
					headers: {'APIKey': process.env.APIKEY,
							'Content-Type':'application/json'}},
							)
				.then(response => {
					//console.log(response);
					//apiHelper.removeById(Hotpoint, req, res);	
				})
				.catch(error => {
				console.log(error);
				});
				

				for(let idx in filename2){
					axios.delete('http://localhost:3450/api/file/'+ filename2[idx],	
					{data: {filename:filename2[idx]}, 
						headers: {'APIKey': process.env.APIKEY,
								'Content-Type':'application/json'}},
								)
					.then(response => {
						//console.log(response);
						//apiHelper.removeById(Hotpoint, req, res);	
					})
					.catch(error => {
					console.log(error);
					});
				
				}
			

				for(let idx in filename3){
					axios.delete('http://localhost:3450/api/file/'+ filename3[idx],	
					{data: {filename:filename3[idx]}, 
						headers: {'APIKey': process.env.APIKEY,
								'Content-Type':'application/json'}},
								)
					.then(response => {
						//console.log(response);
						//apiHelper.removeById(Hotpoint, req, res);	
					})
					.catch(error => {
					console.log(error);
					});
				
				}
	
				//apiHelper.fileNameUpdate(Collective, req, res, false);

			}else{
				console.log("no files to remove");
			}

			// var filename1 = collective.multimediaFileRef;	

			// var filename2 = []; 
			// var filename3 = [];
			// let galleryLength = collective.gallery.length;
			// let serviceScheduleLength = collective.serviceSchedule.length;
			// console.log(galleryLength);
			// console.log(serviceScheduleLength);

			for(let i = 0 ;i < galleryLength; i++ ){
			  collective.gallery[i].multimediaFileRef = "";
			   
			}
		
			for(let j = 0 ;j < serviceScheduleLength; j++ ){
			  collective.serviceSchedule[j].multimediaFileRef = "";
				
			 }
			 apiHelper.fileNameUpdate(Collective, req, res, false);
			
	
	}else {
	  res.status(500).json({returnCode: false, responseText: 'You do not have access for this.'});
	}
  };

  exports.updateFile = function(req, res){
	console.log("update file");
  if (req.user.level == 1) {
	// allow all fields
	apiHelper.fileNameUpdate(Collective, req, res, false);
  } else {
	res.status(500).json({returnCode: false, responseText: 'You do not have access for this.'});
  }
};

