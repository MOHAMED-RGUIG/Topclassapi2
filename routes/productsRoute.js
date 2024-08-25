const express = require("express");
const router = express.Router();
const { sql, poolPromise,poolPromise2 } = require('../db'); 

router.get('/getallproducts', async (req, res) => {
    let pool;
    try {
        pool = await poolPromise2;
        const request = pool.request();

        const query = `SELECT [ITMREF_0]
      ,[ITMDES1_0]
      ,[TSICOD_0]    
      ,[PRI_0]
      ,[Designation_Famille_Stat1]   FROM  [topclass_sage].[TCE].[ARTICLE_RESUME] WHERE [TSICOD_0] <>'DET'`;

        const result = await request.query(query);

        res.status(200).json(result.recordset);
    } catch (error) {
        if (pool) {
            try {
                await pool.close();
            } catch (e) {
                console.error('Error closing MSSQL pool', e);
            }
        }
        console.error('Error getting user orders:', error);
        return res.status(400).json({ message: 'Something went wrong', error: error.message });
    }
});

router.get("/getallimgproducts",async(req,res)=>
{
    try{
            const products = await Product.find({});
            res.send(products);
    } catch(error){
        return res.status(400).json({message: error});
    }   
}
)
module.exports = router;

