const express = require('express')
const fs = require('fs');
const { callbackify } = require('util');
const app = express()
const port = 3000

const dbInit = require('./database/init');
const discussionModel = require('./database/discussions')

dbInit(function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("db Connected");
        app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`)
        })
    }
})

app.use(function (req, res, next) {
    console.log(req.method, req.path);
    next();
})
app.use(express.json());
app.use(express.static("public"));


app.get('/analysis/:username', (req, res) => {
    let username = req.params.username;
    getUserAnalytics(username,(err, data) => {
        if (err) {
            res.status(500).json({
                data: null,
                messgae: "somethig went wrong"
            })
        }
        else {
            res.status(200).json({
                data: data,
                messgae: ""
            })
        }
    })
});
app.get('/data/:sort', (req, res) => {
    let sort = parseInt(req.params.sort);
    let property = 'isFavorite';
    let type = -1;
    switch (sort) {
        case 1:
            property = 'createdAt';
            type = 1;
            break;
        case 2:
            property = 'createdAt';
            type = -1;
            break;
        case 3:
            property = 'subject';
            type = 1;
            break;
        case 4:
            property = 'subject';
            type = -1;
            break;
        case 5:
            property = 'username';
            type = 1;
            console.log(property);
            break;
        case 6:
            property = 'username';
            type = -1;
            break;
        case 7:
            property = 'isFavorite';
            type = 1;
            break;
        case 8:
            property = 'isFavorite';
            type = -1;
            break;
        default:
            property = 'isFavorite';
            type = -1;
            break;
    }

    getAllDiscussions(property,type,(err, discussions) => {
        if (err) {
            res.status(500).json({
                data: null,
                messgae: "somethig went wrong"
            })
        }
        else {
            res.status(200).json({
                data: discussions,
                messgae: ""
            })
        }
    })
});
app.post('/data', (req, res) => {
    saveDiscussion(req.body, (err, discussion) => {

        if (err) {
            res.status(500).send({ message: "something went wrong" })
        }
        else {
            res.status(200).send({ message: "discussion saved", discussion });
        }
    })
})
app.delete('/resolve', (req, res) => {

    removeDiscussion(req.body.id, (err) => {
        if (err) {
            res.status(500).send({ message: "something went wrong" })
        }
        else {
            res.status(200).send({ message: "discussion removed" });
        }
    })

});
app.post('/response', (req, res) => {
    addResponse(req.body.id, req.body.response, (err) => {
        if (err) {
            res.status(500).send({ message: "something went wrong" })
        }
        else {
            res.status(200).send({ message: "response saved successfully" });
        }
    })

});
app.post('/fav', (req, res) => {

    updateFavourite(req.body.id, req.body.isFav, (err) => {
        if (err) {
            res.status(500).send({ message: "something went wrong" })
        }
        else {
            res.status(200).send({ message: "favourite updated successfully" });
        }
    })
});
app.post('/vote', (req, res) => {
    const dId = req.body.dId;
    const rId = req.body.rId;
    const upVote = req.body.upVote;
    const downVote = req.body.downVote;
    updateVpteCount(dId, rId, upVote, downVote, (err) => {
        if (err) {
            res.status(500).send({ message: "something went wrong" })
        }
        else {
            upVote
            res.status(200).send({ message: "vote updated successfully", upVote, downVote });
        }
    })

});

function saveDiscussion(discussion, callback) {
    discussionModel.create(discussion)
        .then((updatedDIscussion) => {

            callback(null, updatedDIscussion)
        })
        .catch(function (err) {
            callback(err, null);
        });
}
function getAllDiscussions(property,type,callback) {
    discussionModel.find()
        .sort({ [property]: type })
        .then((data) => {
            callback(null, data);
        })
        .catch((err) => {
            callback(err, data);
        })
}
function removeDiscussion(id, callback) {
    discussionModel.findByIdAndRemove(id)
        .then((data) => {
            callback(null)
        })
        .catch((err) => {
            callback(err)
        })
}
function addResponse(id, response, callback) {

    discussionModel.findByIdAndUpdate(id, {
        $push: {
            responses: response
        }
    }, (err, data) => {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });

}
function updateFavourite(id, isFav, callback) {
    discussionModel.findByIdAndUpdate(id, {
        $set: {
            isFavorite: isFav
        }
    }, (err, data) => {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
}
function updateVpteCount(id, rId, upVote, downVote, callback) {

    discussionModel.updateOne(
        {
            _id: id,
            'responses._id': rId
        },
        {
            $set: {
                'responses.$.upVote': upVote,
                'responses.$.downVote': downVote,
            }
        }
        , (err, data) => {
            if (err) {
                callback(err);
            } else {
                callback(null);
            }
        });
}
function getUserAnalytics(username, callback) {
    discussionModel.find({username}).
    then((data)=>{
    
        callback(null, data);
    })
    .catch((err)=>{
        callback(err,null);
    });
}
