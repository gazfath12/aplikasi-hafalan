import { Pool } from 'pg';
import { Router } from 'express';
import dotenv from 'dotenv';
dotenv.config();
// Database connection
const pool = new Pool({
    user: 'postgres.hmzefbhgxytxbliiropb',
    host: 'aws-0-ap-southeast-1.pooler.supabase.com',
    database: 'postgres',
    password: 'ppqitasandbox123',
    port: 6543,
});
const router = Router();
// user=postgres.hmzefbhgxytxbliiropb password=[YOUR-PASSWORD] host=aws-0-ap-southeast-1.pooler.supabase.com port=6543 dbname=postgres
interface MemorizationRecord {
    id: number;
    name: string;
    surah_from: number;
    ayat_from: number;
    surah_to: number;
    ayat_to: number;
    status: 'belum_lancar' | 'lancar' | 'sangat_lancar';
    created_at: Date;
    updated_at: Date;
}

// Create new record
router.post('/hafalan', async (req, res) => {
    try {
        const { name, surah_from, ayat_from, surah_to, ayat_to, status } = req.body;
        const query = `
INSERT INTO memorization_records
(name, surah_from, ayat_from, surah_to, ayat_to, status)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *
`;
        const values = [name, surah_from, ayat_from, surah_to, ayat_to, status];
        const result = await pool.query(query, values);
        res.json({ status: 'success', data: result.rows[0] });
    } catch (err: any) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});
// Get all records
router.get('/hafalan', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM memorization_records ORDER BY created_at DESC');
        res.json({ status: 'success', data: result.rows });
    } catch (err: any) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});
// Get single record
router.get('/hafalan/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM memorization_records WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Record not found' });
        }
        res.json({ status: 'success', data: result.rows[0] });
    } catch (err: any) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});
// Update record
router.put('/hafalan/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const result = await pool.query(
            'UPDATE memorization_records SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING * ', [status, id]
        );
        res.json({ status: 'success', data: result.rows[0] });
    } catch (err: any) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});
// Delete record
router.delete('/hafalan/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM memorization_records WHERE id = $1', [id]);
        res.json({ status: 'success', message: 'Record deleted successfully' });
    } catch (err: any) {
        res.status(500).json({ status: 'error', message: err.message });

    }
});
export default router;