const express = require("express");
const Projects = require('./projects-model');
const{
    validateProjectId 
} = require('./projects-middleware');


const router = express.Router();

//**get requests**//

//first request: Returns an array of projects as the body of the response and if there are no projects it responds with an empty array
router.get('/', async (req, res)=>{
    try{
        const projects = await Projects.get();
        res.status(200).json(projects);
    }
    catch(err){
        res.status(500).json({
            message: "There was an issue accessing the server with your information"
        })
    }
})

//second request: Returns a project with the given id as the body of the response and if there is no project with the given id it responds with a status code 404.

router.get('/:id', validateProjectId, async (req, res, next)=>{
    try{
        const id = req.params.id;
        const projectFromId = await Projects.get(id);
        res.status(200).json(projectFromId);
        
    }
    catch(err){
        next(err)
    }
})

//third request: Returns an array of actions (could be empty) belonging to a project with the given id.If there is no project with the given id it responds with a status code 404.
router.get('/:id/actions',validateProjectId, async (req,res,next)=>{
    try{
        const id = req.params.id;
        const projectActions = await Projects.getProjectActions(id);
        res.status(200).json(projectActions);
        
    }
    catch(err){
        next(err)
    }
})
//**get requests**//

//**post requests**//

//first request: Returns the newly created project as the body of the response and if the request body is missing any of the required fields it responds with a status code 400.
router.post('/', async (req,res)=>{
    try{
        const {name, description}=req.body;

        if(!name || !description){
            res.status(400).json({
                message: "We need both the name of the project and the description of the project before we can save it in our server."
            })
        }
        else{
            const newProject = await Projects.insert(req.body)
            res.status(201).json(newProject)
        }
    }
    catch(err){
        res.status(500).json({
            message: "There was an issue accessing the server with your information" 
        })
    }
})
//**post requests**//


//**put requests**//
//first request: Returns the updated project as the body of the response. If there is no project with the given id it responds with a status code 404. If the request body is missing any of the required fields it responds with a status code 400

router.put('/:id', validateProjectId, async(req, res, next)=>{
    try{
        const {name, description, completed} = req.body;
        
        if(!name|| !description|| typeof completed==="undefined"){
            res.status(400).json({message: " We need all information: name, description, and completed boolean value"})
        } else{
            const updatedProject = await Projects.update(req.params.id, req.body)
            res.status(200).json(updatedProject);
        }
    }
    catch(err){
        next(err)
    }
})
//**put requests**//

//**delete requests**//
//first request: Returns no response body. If there is no project with the given id it responds with a status code 404.

router.delete('/:id', validateProjectId, async (req,res,next)=>{
    try{
        await Projects.remove(req.params.id)
        res.end()
    }
    catch(err){
        next(err)
    }
})
//**delete requests**//





// do not forget to export the router
module.exports=router;
