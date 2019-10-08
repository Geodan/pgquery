const dbconfig = require('./config.json');
const pg = require('pg');
const express = require('express');
const logger = require('morgan');
const app = express();

const pool = new pg.Pool(dbconfig);
app.use(logger(':date[iso] ":method :url"'));

const port = 8306;

/*
const DirCache = require('./dircache.js')
const cache = new DirCache(`./cache/${dbconfig.database?dbconfig.database:process.env.PGDATABASE?process.env.PGDATABASE:''}`);

let cacheMiddleware = async(req, res, next) => {
    if (!cache) {
      next();
      return;
    }
    const cacheDir = `${req.params.table}/bbox`
    const key = ((req.query.geom_column?req.query.geom_column:'geom') 
      + (req.query.columns?'_'+req.query.columns:'')
      + (req.query.filter?'_'+req.query.filter:''))
      .replace(/[\W]+/g, '_');
  
    const bbox = await cache.getCachedFile(cacheDir, key);
    if (bbox) {
      console.log(`bbox cache hit for ${cacheDir}?${key}`);
      res.header('Content-Type', 'application/json').send(bbox);
      return;
    } else {
      res.sendResponse = res.send;
      res.send = (body) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          cache.setCachedFile(cacheDir, key, body);
        }
        res.sendResponse(body);
      }
      next();
    }
  }
*/
app.get('/api/query/:z/:x/:y', async (request, response)=>{
    let sql = `select * 
        from mytable 
            where 
                z = ${request.params.z}
                and x = ${request.params.x}
                and y = ${request.params.y}
                and ok = '${request.query.a}'
                and text = '${request.query.b}'`;
    //console.log(sql);
    try {
        let queryResult = await pool.query(sql);
        response.send(queryResult);
    } catch(err) {
        response.status(500).send(err.message);
    }
})


const server = app.listen(port);
server.setTimeout(600000);
console.log(`pgserver listening on port ${port}`);
