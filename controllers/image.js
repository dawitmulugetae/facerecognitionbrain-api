const PAT = '3ea394cf64194d3bae0916e881ecc40d';
const USER_ID = 'clarifai';       
const APP_ID = 'main';
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105'; 

export const  handleApiCall = async(req, res)  => {


let raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": req.body.input
                }
            }
        }
    ]
  });
  
  let requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
  };
  
  await fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
  .then(response => response.json())
  .then(response => res.json(response))

}

export const handleImage = (db) => (req, res ) => {
    const { id } = req.body;
    db('users')
    .where('id', '=', id)
    .increment({
        entries: 1
    })
    .returning('entries')
    .then(count => {
        res.json(count[0].entries)
    }).catch(err => res.status(400).json('unable to get entries'))
}