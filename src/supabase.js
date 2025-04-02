// This file is kept as a placeholder in case we need to re-integrate Supabase in the future
// Currently all form submissions go directly to Pipedrive CRM

// Mock supabase client for compatibility
export const supabase = {
  from: () => ({
    insert: () => ({
      select: () => ({
        single: () => Promise.resolve({ data: { id: 'mock-id' }, error: null })
      })
    }),
    select: () => Promise.resolve({ data: [], error: null }),
    delete: () => ({
      eq: () => Promise.resolve({ error: null })
    }),
    update: () => ({
      eq: () => Promise.resolve({ error: null })
    })
  })
};
