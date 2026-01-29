// controllers/userController.js
import supabase from '../utils/supabaseClient.js';
import { getTenantQuery } from '../utils/tenantQuery.js';

export async function listUsers(req, res) {
  try {
    const { data, error } = await getTenantQuery(
      supabase.from('org_members')
      .select(`
      role,
      user:user_id (
        id,
        email
      )
    `),
      req.org.id
    );

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
