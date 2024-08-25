const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db');

router.post('/placeorder', async (req, res) => {
    let pool;
    try {
        const { subtotal, currentUser, cartItems, codeClient,rS, modalitePai, dateCmd } = req.body;

        const orderDate = new Date(dateCmd);
        const month = (orderDate.getMonth() + 1).toString().padStart(2, '0');
        const year = orderDate.getFullYear().toString().slice(-2);

        pool = await poolPromise;

        const counterQuery = `
            SELECT MAX(CAST(SUBSTRING(SOHNUM, 10, LEN(SOHNUM)) AS INT)) AS maxCounter
            FROM topclass.SORDER
            WHERE SUBSTRING(SOHNUM, 5, 2) = @month AND SUBSTRING(SOHNUM, 7, 2) = @year
        `;
        const result = await pool.request()
            .input('month', sql.NVarChar, month)
            .input('year', sql.NVarChar, year)
            .query(counterQuery);

        const lastCounter = result.recordset[0]?.maxCounter || 0;
        const newCounter = lastCounter + 1;

        const SOHNUM = `SOH-${month}${year}-${newCounter}`;

        console.log('Generated SOHNUM:', SOHNUM);

        const transaction = pool.transaction();
        await transaction.begin();

        for (let item of cartItems) {
            const { ITMREF_0, ITMDES1_0, PRI_0, price, quantity,isChecked } = item;

            const request = transaction.request();

            request.input('dateCmd', sql.Date, dateCmd);
            request.input('codeClient', sql.NVarChar, codeClient);
            request.input('itmref', sql.NVarChar, ITMREF_0);
            request.input('itmdes', sql.NVarChar, ITMDES1_0);
            request.input('qty', sql.Int, quantity);
            request.input('grat', sql.Int, isChecked);
            request.input('subtotal', sql.Decimal(18, 2), subtotal);
            request.input('netpri', sql.Decimal(18, 2), PRI_0);
            request.input('totlin', sql.Decimal(18, 2), price);
            request.input('modalitePai', sql.NVarChar, modalitePai);
            request.input('userID', sql.Int, currentUser.ID);
            request.input('rS', sql.NVarChar, rS);

            const query = `
                INSERT INTO topclass.SORDER 
                (SOHNUM, ORDDAT, BPCORD, ITMREF, ITMDES, QTY, GRAT, NETPRI, TOTLIN, MODPAY, [USER], CREDAT,BPCNAME) 
                VALUES (@SOHNUM, @dateCmd, @codeClient, @itmref, @itmdes, @qty, @grat, @netpri, @totlin, @modalitePai, @userID, GETDATE(),@rS)
            `;
            await request.input('SOHNUM', sql.NVarChar, SOHNUM).query(query);
        }

        await transaction.commit();

        res.status(201).send('Order registered successfully');
    } catch (error) {
        if (pool) {
            try {
                await pool.close();
            } catch (e) {
                console.error('Error closing MSSQL pool', e);
            }
        }
        console.error('Error placing order:', error);
        return res.status(400).json({ message: 'Something went wrong', error: error.message });
    }
});

router.post('/getuserorders', async (req, res) => {
    let pool;
    try {
        const { currentUser } = req.body;

        if (!currentUser || !currentUser.ID) {
            return res.status(400).json({ message: 'User ID is missing or undefined' });
        }

        pool = await poolPromise;
        const request = pool.request();

        request.input('userid', sql.Int, currentUser.ID);

        const query = `
            SELECT * FROM topclass.SORDER WHERE [USER] = @userid
        `;

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


module.exports = router;
