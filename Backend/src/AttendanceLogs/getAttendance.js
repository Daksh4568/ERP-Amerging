const connectToSQL = require('./sqlConnection');

module.exports.getAttendanceData = async (req, res) => {
    const { eID, startDate, endDate } = req.query;

    // if (!eID || !startDate || !endDate) {
    //     return res.status(400).json({ error: "Missing required parameters" });
    // }

    try {
        const pool = await connectToSQL();

        const result = await pool.request()
            .input('eID', sql.VarChar, eID)
            .input('startDate', sql.Date, startDate)
            .input('endDate', sql.Date, endDate)
            .query(`
        SELECT * FROM AttendanceTable
        WHERE EmployeeID = @eID AND Date BETWEEN @startDate AND @endDate
      `);

        res.status(200).json({ data: result.recordset });
    } catch (error) {
        console.error('Fetch Attendance Error:', error);
        res.status(500).json({ error: "Failed to fetch attendance data" });
    }
};
