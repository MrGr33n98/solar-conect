import React, { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext'; // To get the token

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

interface CategoryFormData {
  name: string;
  slug: string;
  description?: string;
}

export const AdminCategoriesPage: React.FC = () => {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CategoryFormData>({ name: '', slug: '', description: '' });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Fetch Categories
  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Authentication token not found. Please log in as admin.");
      return;
    }
    setIsLoading(true);
    setError(null);

    const url = editingCategory ? `/api/categories/${editingCategory.slug}` : '/api/categories';
    const method = editingCategory ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || (editingCategory ? 'Failed to update category' : 'Failed to create category'));
      }
      // Backend should return the created/updated category, so we can get the definitive slug
      const savedCategory = await response.json();

      setFormData({ name: '', slug: '', description: '' }); // Reset form
      setEditingCategory(null); // Reset editing state
      fetchCategories(); // Refresh list (or update state directly with savedCategory)
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, slug: category.slug, description: category.description || '' });
  };

  const handleDelete = async (slug: string) => {
    if (!token) {
        setError("Authentication token not found.");
        return;
    }
    if (!window.confirm(`Are you sure you want to delete category with slug "${slug}"?`)) return;

    setIsLoading(true);
    setError(null);
    try {
        const response = await fetch(`/api/categories/${slug}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete category');
        }
        fetchCategories(); // Refresh list
    } catch (err: any) {
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '', description: '' });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: 'auto' }}>
      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Admin - Manage Categories</h2>

      {error && <p style={{ color: 'white', backgroundColor: 'red', padding: '10px', borderRadius: '5px' }}>Error: {error}</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
        <h3>{editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create New Category'}</h3>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>Name: </label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required
                 style={{ width: 'calc(100% - 22px)', padding: '10px', border: '1px solid #ccc', borderRadius: '3px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="slug" style={{ display: 'block', marginBottom: '5px' }}>Slug (auto-generated if blank, or specify): </label>
          <input type="text" id="slug" name="slug" value={formData.slug} onChange={handleInputChange}
                 style={{ width: 'calc(100% - 22px)', padding: '10px', border: '1px solid #ccc', borderRadius: '3px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '5px' }}>Description: </label>
          <textarea id="description" name="description" value={formData.description} onChange={handleInputChange}
                    style={{ width: 'calc(100% - 22px)', padding: '10px', border: '1px solid #ccc', borderRadius: '3px', minHeight: '80px' }} />
        </div>
        <div>
          <button type="submit" disabled={isLoading}
                  style={{ padding: '10px 15px', backgroundColor: isLoading ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
            {isLoading ? 'Saving...' : (editingCategory ? 'Update Category' : 'Create Category')}
          </button>
          {editingCategory &&
            <button type="button" onClick={cancelEdit} style={{ marginLeft: '10px', padding: '10px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
              Cancel Edit
            </button>}
        </div>
      </form>

      <h3>Existing Categories</h3>
      {isLoading && categories.length === 0 && <p>Loading categories...</p>}
      {!isLoading && !error && categories.length === 0 && <p>No categories found. Create one above!</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {categories.map(cat => (
          <li key={cat.id} style={{ marginBottom: '10px', padding: '15px', border: '1px solid #eee', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: '1.1em' }}>{cat.name}</strong> (Slug: {cat.slug})
              <p style={{ margin: '5px 0 0', color: '#555' }}>{cat.description || 'No description'}</p>
            </div>
            <div>
              <button onClick={() => handleEdit(cat)} style={{ marginRight: '10px', padding: '8px 12px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Edit</button>
              <button onClick={() => handleDelete(cat.slug)} disabled={isLoading} style={{ padding: '8px 12px', backgroundColor: isLoading ? '#ccc' : '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
