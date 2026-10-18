import React, { useState } from 'react';
import { StoreData, Product, Category, Testimonial } from '../types';
import { Plus, Edit, Trash2, Image as ImageIcon, Check, Save, ShieldCheck, Package, Grid, FileText, Star, ArrowLeft } from 'lucide-react';

interface AdminCenterProps {
  storeData: StoreData;
  onRefreshData: () => void;
  setCurrentView: (view: string) => void;
}

export function AdminCenter({ storeData, onRefreshData, setCurrentView }: AdminCenterProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'content' | 'testimonials'>('products');

  // Product Form State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: 0,
    description: '',
    categoryId: storeData.categories[0]?.id || '',
    images: [''],
    isFeatured: false,
    availability: 'In Stock' as 'In Stock' | 'Made to Order' | 'Out of Stock',
    sortOrder: 1
  });

  // Category Form State
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    image: '',
    sortOrder: 1
  });

  // Content Form State
  const [contentForm, setContentForm] = useState(storeData.content);

  // Testimonial Form State
  const [testimonialForm, setTestimonialForm] = useState({
    author: '',
    location: '',
    comment: '',
    rating: 5
  });

  const [uploading, setUploading] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState('');

  const persistOpenForms = async () => {
    if (editingProduct || productForm.name.trim()) {
      const url = editingProduct ? '/api/products/' + editingProduct.id : '/api/products';
      const response = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productForm)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'The product draft could not be saved.');
      setEditingProduct(null);
      setProductForm({
        name: '',
        price: 0,
        description: '',
        categoryId: storeData.categories[0]?.id || '',
        images: [''],
        isFeatured: false,
        availability: 'In Stock',
        sortOrder: 1
      });
    }

    if (editingCategory || categoryForm.name.trim()) {
      const url = editingCategory ? '/api/categories/' + editingCategory.id : '/api/categories';
      const response = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryForm)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'The category draft could not be saved.');
      setEditingCategory(null);
      setCategoryForm({ name: '', description: '', image: '', sortOrder: 1 });
    }

    if (testimonialForm.author.trim() && testimonialForm.comment.trim()) {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testimonialForm)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'The testimonial draft could not be saved.');
      setTestimonialForm({ author: '', location: '', comment: '', rating: 5 });
    }

    const contentResponse = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contentForm)
    });
    const contentResult = await contentResponse.json().catch(() => ({}));
    if (!contentResponse.ok) throw new Error(contentResult.error || 'Could not save the website content draft.');
  };

  const handleSaveDraft = async () => {
    setSavingDraft(true);
    try {
      await persistOpenForms();
      setMessage('Draft saved securely. Visitors will not see these changes until you publish.');
      await onRefreshData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Draft could not be saved. Please try again.');
    } finally {
      setSavingDraft(false);
    }
  };

  const handlePublishChanges = async () => {
    setPublishing(true);
    try {
      await persistOpenForms();
      const response = await fetch('/api/admin/publish', { method: 'POST' });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Publish failed. Your saved draft is still available.');
      setMessage('Changes published successfully. The public website now uses the published content.');
      await onRefreshData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Publishing failed. Your draft has been preserved.');
    } finally {
      setPublishing(false);
    }
  };

  // Handle Product Save
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productForm)
      });
      if (res.ok) {
        setMessage(editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
        setEditingProduct(null);
        setProductForm({
          name: '',
          price: 0,
          description: '',
          categoryId: storeData.categories[0]?.id || '',
          images: [''],
          isFeatured: false,
          availability: 'In Stock',
          sortOrder: 1
        });
        onRefreshData();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      onRefreshData();
      setMessage('Product deleted successfully.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditProductClick = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price,
      description: product.description,
      categoryId: product.categoryId,
      images: product.images.length > 0 ? [...product.images] : [''],
      isFeatured: product.isFeatured,
      availability: product.availability,
      sortOrder: product.sortOrder || 1
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Category Save
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryForm)
      });
      if (res.ok) {
        setMessage(editingCategory ? 'Category updated successfully!' : 'Category added successfully!');
        setEditingCategory(null);
        setCategoryForm({ name: '', description: '', image: '', sortOrder: 1 });
        onRefreshData();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      onRefreshData();
      setMessage('Category deleted successfully.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Content Save
  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contentForm)
      });
      if (res.ok) {
        setMessage('Website content updated successfully!');
        onRefreshData();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Testimonial Add
  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testimonialForm)
      });
      if (res.ok) {
        setMessage('Testimonial added successfully!');
        setTestimonialForm({ author: '', location: '', comment: '', rating: 5 });
        onRefreshData();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    try {
      await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
      onRefreshData();
      setMessage('Testimonial removed.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Image upload failed.');
      if (Array.isArray(data.urls) && data.urls.length > 0) {
        callback(data.urls[0]);
        setMessage('Image uploaded successfully.');
      } else {
        throw new Error('The server did not return an image URL.');
      }
    } catch (err) {
      console.error(err);
      setMessage(err instanceof Error ? err.message : 'Image upload failed. Please try again.');
    } finally {
      e.target.value = '';
      setUploading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1c1917] text-white p-8 rounded-3xl shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#f59e0b] text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Persistent Management System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold">Cole World Admin Center</h1>
          <p className="text-xs text-[#a8a29e]">Manage products, categories, homepage content, and customer testimonials.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleSaveDraft}
            disabled={savingDraft || publishing || uploading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#292524] text-white text-xs font-semibold hover:bg-[#57534e] disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{savingDraft ? 'Saving Draft...' : 'Save Draft'}</span>
          </button>
          <button
            onClick={handlePublishChanges}
            disabled={savingDraft || publishing || uploading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#b45309] text-white text-xs font-semibold hover:bg-[#92400e] disabled:opacity-50 transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>{publishing ? 'Publishing...' : 'Publish Changes'}</span>
          </button>
          <button
            onClick={() => setCurrentView('home')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#292524] text-white text-xs font-semibold hover:bg-[#57534e] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Website</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-sm font-medium shadow-xs">
          {message}
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#e7e5e4]">
        {[
          { id: 'products', label: 'Products Management', icon: Package },
          { id: 'categories', label: 'Categories', icon: Grid },
          { id: 'content', label: 'Homepage & Business Content', icon: FileText },
          { id: 'testimonials', label: 'Testimonials', icon: Star },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#b45309] text-white shadow-md'
                  : 'bg-white text-[#57534e] border border-[#e7e5e4] hover:bg-[#f5f5f4]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-10">
          
          {/* Add / Edit Product Form */}
          <div className="bg-white p-8 rounded-3xl border border-[#e7e5e4] shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#e7e5e4] pb-4">
              <h3 className="font-serif font-bold text-xl text-[#1c1917]">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              {editingProduct && (
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setProductForm({ name: '', price: 0, description: '', categoryId: storeData.categories[0]?.id || '', images: [''], isFeatured: false, availability: 'In Stock', sortOrder: 1 });
                  }}
                  className="text-xs text-[#b45309] font-semibold hover:underline"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403c] mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Royal Velvet Sectional Sofa"
                    className="w-full px-4 py-3 rounded-xl bg-[#faf9f6] border border-[#e7e5e4] text-sm focus:outline-none focus:border-[#b45309]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403c] mb-1">Price (₦ - Naira)</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    placeholder="e.g. 650000"
                    className="w-full px-4 py-3 rounded-xl bg-[#faf9f6] border border-[#e7e5e4] text-sm focus:outline-none focus:border-[#b45309]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403c] mb-1">Category</label>
                  <select
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#faf9f6] border border-[#e7e5e4] text-sm focus:outline-none focus:border-[#b45309]"
                  >
                    {storeData.categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403c] mb-1">Availability</label>
                  <select
                    value={productForm.availability}
                    onChange={(e) => setProductForm({ ...productForm, availability: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl bg-[#faf9f6] border border-[#e7e5e4] text-sm focus:outline-none focus:border-[#b45309]"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Made to Order">Made to Order</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403c] mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={productForm.sortOrder}
                    onChange={(e) => setProductForm({ ...productForm, sortOrder: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl bg-[#faf9f6] border border-[#e7e5e4] text-sm focus:outline-none focus:border-[#b45309]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403c] mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Detailed product specifications..."
                  className="w-full px-4 py-3 rounded-xl bg-[#faf9f6] border border-[#e7e5e4] text-sm focus:outline-none focus:border-[#b45309]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403c] mb-1">Product Images (URLs or Upload)</label>
                <div className="space-y-3">
                  {productForm.images.map((img, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={img}
                        onChange={(e) => {
                          const newImages = [...productForm.images];
                          newImages[index] = e.target.value;
                          setProductForm({ ...productForm, images: newImages });
                        }}
                        placeholder="https://images.unsplash.com/... or upload"
                        className="flex-1 px-4 py-2.5 rounded-xl bg-[#faf9f6] border border-[#e7e5e4] text-sm"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, (url) => {
                          const newImages = [...productForm.images];
                          newImages[index] = url;
                          setProductForm({ ...productForm, images: newImages });
                        })}
                        className="text-xs file:mr-2 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#1c1917] file:text-white hover:file:bg-[#b45309]"
                      />
                      {productForm.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = productForm.images.filter((_, i) => i !== index);
                            setProductForm({ ...productForm, images: newImages });
                          }}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setProductForm({ ...productForm, images: [...productForm.images, ''] })}
                    className="text-xs font-semibold text-[#b45309] hover:underline"
                  >
                    + Add Another Image URL
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={productForm.isFeatured}
                  onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                  className="w-4 h-4 rounded text-[#b45309] focus:ring-[#b45309]"
                />
                <label htmlFor="isFeatured" className="text-sm font-medium text-[#1c1917]">Feature this product on Homepage</label>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#b45309] text-white font-semibold text-sm shadow-md hover:bg-[#92400e] transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingProduct ? 'Save Changes' : 'Publish Product'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Product List Table */}
          <div className="bg-white rounded-3xl border border-[#e7e5e4] shadow-xs overflow-hidden">
            <div className="p-6 border-b border-[#e7e5e4]">
              <h3 className="font-serif font-bold text-xl text-[#1c1917]">Existing Products ({storeData.products.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#faf9f6] border-b border-[#e7e5e4] text-xs font-semibold uppercase tracking-wider text-[#78716c]">
                    <th className="p-4">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Availability</th>
                    <th className="p-4">Featured</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e7e5e4] text-sm">
                  {storeData.products.map((p) => {
                    const catName = storeData.categories.find(c => c.id === p.categoryId)?.name || 'N/A';
                    return (
                      <tr key={p.id} className="hover:bg-[#faf9f6]">
                        <td className="p-4 flex items-center gap-3">
                          <img src={p.images[0] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=200"} alt="" className="w-12 h-12 rounded-xl object-cover border border-[#e7e5e4]" />
                          <div>
                            <p className="font-semibold text-[#1c1917]">{p.name}</p>
                            <p className="text-xs text-[#78716c] line-clamp-1">{p.description}</p>
                          </div>
                        </td>
                        <td className="p-4 text-[#57534e]">{catName}</td>
                        <td className="p-4 font-serif font-bold text-[#1c1917]">₦{p.price.toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.availability === 'In Stock' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {p.availability}
                          </span>
                        </td>
                        <td className="p-4">
                          {p.isFeatured ? <span className="text-xs font-semibold text-[#b45309]">Yes</span> : <span className="text-xs text-[#78716c]">No</span>}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleEditProductClick(p)}
                            className="p-2 rounded-xl bg-gray-100 text-[#1c1917] hover:bg-[#b45309] hover:text-white transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: CATEGORIES MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="space-y-10">
          <div className="bg-white p-8 rounded-3xl border border-[#e7e5e4] shadow-xs space-y-6">
            <h3 className="font-serif font-bold text-xl text-[#1c1917]">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            <form onSubmit={handleSaveCategory} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403c] mb-1">Category Name</label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    placeholder="e.g. Living Room"
                    className="w-full px-4 py-3 rounded-xl bg-[#faf9f6] border border-[#e7e5e4] text-sm focus:outline-none focus:border-[#b45309]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403c] mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={categoryForm.sortOrder}
                    onChange={(e) => setCategoryForm({ ...categoryForm, sortOrder: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl bg-[#faf9f6] border border-[#e7e5e4] text-sm focus:outline-none focus:border-[#b45309]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403c] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="Short description..."
                  className="w-full px-4 py-3 rounded-xl bg-[#faf9f6] border border-[#e7e5e4] text-sm focus:outline-none focus:border-[#b45309]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403c] mb-1">Category Image URL or Upload</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={categoryForm.image}
                    onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#faf9f6] border border-[#e7e5e4] text-sm"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, (url) => setCategoryForm({ ...categoryForm, image: url }))}
                    className="text-xs file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-[#1c1917] file:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-8 py-3.5 rounded-2xl bg-[#b45309] text-white font-semibold text-sm shadow-md hover:bg-[#92400e] transition-all"
              >
                {editingCategory ? 'Save Category' : 'Add Category'}
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {storeData.categories.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl overflow-hidden border border-[#e7e5e4] shadow-xs flex flex-col justify-between">
                <div className="relative h-40">
                  <img src={c.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="p-5 space-y-2">
                  <h4 className="font-serif font-bold text-lg text-[#1c1917]">{c.name}</h4>
                  <p className="text-xs text-[#78716c] line-clamp-2">{c.description}</p>
                </div>
                <div className="p-4 border-t border-[#f5f5f4] flex items-center justify-between">
                  <button
                    onClick={() => {
                      setEditingCategory(c);
                      setCategoryForm({ name: c.name, description: c.description, image: c.image, sortOrder: c.sortOrder || 1 });
                    }}
                    className="text-xs font-semibold text-[#b45309] hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(c.id)}
                    className="text-xs font-semibold text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CONTENT MANAGEMENT */}
      {activeTab === 'content' && (
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#e7e5e4] shadow-xs space-y-6">
          <h3 className="font-serif font-bold text-2xl text-[#1c1917]">Edit Homepage & Business Content</h3>
          
          <form onSubmit={handleSaveContent} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403c] mb-1">Hero Title</label>
              <input
                type="text"
                value={contentForm.heroTitle}
                onChange={(e) => setContentForm({ ...contentForm, heroTitle: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#faf9f6] border border-[#e7e5e4] text-sm focus:outline-none focus:border-[#b45309]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403c] mb-1">Hero Subtitle</label>
              <textarea
                rows={3}
                value={contentForm.heroSubtitle}
                onChange={(e) => setContentForm({ ...contentForm, heroSubtitle: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#faf9f6] border border-[#e7e5e4] text-sm focus:outline-none focus:border-[#b45309]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403c] mb-1">About Us Text</label>
              <textarea
                rows={4}
                value={contentForm.aboutText}
                onChange={(e) => setContentForm({ ...contentForm, aboutText: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#faf9f6] border border-[#e7e5e4] text-sm focus:outline-none focus:border-[#b45309]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403c] mb-1">Interior Design Services Text</label>
              <textarea
                rows={4}
                value={contentForm.interiorDesignText}
                onChange={(e) => setContentForm({ ...contentForm, interiorDesignText: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#faf9f6] border border-[#e7e5e4] text-sm focus:outline-none focus:border-[#b45309]"
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#b45309] text-white font-semibold text-sm shadow-md hover:bg-[#92400e] transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Website Content</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: TESTIMONIALS MANAGEMENT */}
      {activeTab === 'testimonials' && (
        <div className="space-y-10">
          <div className="bg-white p-8 rounded-3xl border border-[#e7e5e4] shadow-xs space-y-6">
            <h3 className="font-serif font-bold text-xl text-[#1c1917]">Add Customer Testimonial</h3>
            <form onSubmit={handleAddTestimonial} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403c] mb-1">Client Name / Title</label>
                  <input
                    type="text"
                    required
                    value={testimonialForm.author}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, author: e.target.value })}
                    placeholder="e.g. Dr. & Mrs. Pam"
                    className="w-full px-4 py-3 rounded-xl bg-[#faf9f6] border border-[#e7e5e4] text-sm focus:outline-none focus:border-[#b45309]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403c] mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={testimonialForm.location}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, location: e.target.value })}
                    placeholder="e.g. Jos, Plateau State"
                    className="w-full px-4 py-3 rounded-xl bg-[#faf9f6] border border-[#e7e5e4] text-sm focus:outline-none focus:border-[#b45309]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403c] mb-1">Comment</label>
                <textarea
                  rows={3}
                  required
                  value={testimonialForm.comment}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, comment: e.target.value })}
                  placeholder="Client review..."
                  className="w-full px-4 py-3 rounded-xl bg-[#faf9f6] border border-[#e7e5e4] text-sm focus:outline-none focus:border-[#b45309]"
                />
              </div>

              <button
                type="submit"
                className="px-8 py-3.5 rounded-2xl bg-[#b45309] text-white font-semibold text-sm shadow-md hover:bg-[#92400e] transition-all"
              >
                Add Testimonial
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {storeData.content.testimonials?.map((t) => (
              <div key={t.id} className="bg-white p-6 rounded-2xl border border-[#e7e5e4] shadow-xs flex flex-col justify-between space-y-4">
                <p className="font-serif italic text-sm text-[#1c1917]">"{t.comment}"</p>
                <div className="flex items-center justify-between pt-3 border-t border-[#f5f5f4]">
                  <div>
                    <h4 className="font-semibold text-sm text-[#1c1917]">{t.author}</h4>
                    <p className="text-xs text-[#78716c]">{t.location}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteTestimonial(t.id)}
                    className="text-xs font-semibold text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
