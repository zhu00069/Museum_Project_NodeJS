var mongoose = require('mongoose');

require('dotenv').config();

const ACTIVE_STATUS = 'active';
const INACTIVE_STATUS = 'inactive';

const FREESCHEDULE = 'free';
const LOANED = 'loan';

var CollectiveSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
	manufacturDate: {
        type: Date
    },
	account: {
		type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    loanStatus: {
		type: String,
        enum: [LOANED, FREESCHEDULE],
        default: FREESCHEDULE
    },
    valuation: {
        type: Number
    },
    purchaseInformation: {
        type: String,
        required: true
    },
	titleInsurance: {
        type: String
    },
	serviceSchedule:[{
		multimediaFileRef: {type:String},
		description: {type: String},
		date:{type: Date}
	}],
    status: {
        type: String,
        enum: [ACTIVE_STATUS, INACTIVE_STATUS],
        default: ACTIVE_STATUS
    },
	mainLayer: {
		interior: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Layer'
		},
		exterior: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Layer'
		}
		
	},
	beaconLocations: [
		{	uuid: {type: String},
			major: {type: String},
			minor: {type: String},
			proximity: {type: String},
			rssi: {type: String},
			tx: {type: String},
			accuracy: {type: String},
		}
    ],
	multimediaFileRef: {
		type:String
	},
    description: {
		type:String
    },
    additionalInfo:[{
        description: {type:String},
        hyperLink: {type:String}
    }],
    relatedItems:[{
        relatedCollective:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Collective'
        },
        description:{type:String}
    }
    ],
	gallery:[{
		multimediaFileRef: {type:String},
		description: {type:String}
	}]
});

CollectiveSchema.index({name: 'text'});

module.exports = mongoose.model("Collective", CollectiveSchema);
module.exports.ACTIVE_STATUS = ACTIVE_STATUS;
module.exports.INACTIVE_STATUS = ACTIVE_STATUS;

module.exports.FREESCHEDULE = FREESCHEDULE;
module.exports.LOANED = LOANED;
