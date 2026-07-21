"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, ShieldAlert, Check, RefreshCw, Folder, ChevronRight, Edit2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  parentId: string | null;
  subcategories: Category[];
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [parentId, setParentId] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      let isStaticMode = false;
      let data: any = null;

      try {
        const res = await fetch("/api/categories?admin=true");
        if (res.ok) {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            data = await res.json();
          } else {
            isStaticMode = true;
          }
        } else {
          isStaticMode = true;
        }
      } catch (err) {
        isStaticMode = true;
      }

      if (isStaticMode) {
        const res = await fetch("/static-data/categories.json");
        if (res.ok) {
          data = await res.json();
        }
      }

      if (data) {
        setCategories(data);
      } else {
        throw new Error("Failed to load categories catalog");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Auto-generate slug from name in real-time
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!isEditing) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
      setSlug(generatedSlug);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setName("");
    setSlug("");
    setDescription("");
    setImage("");
    setParentId("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;
    setError(null);
    setSuccess(null);

    const payload = {
      id: editId,
      name,
      slug,
      description: description || null,
      image: image || null,
      parentId: parentId || null
    };

    let isStaticMode = false;
    try {
      const testRes = await fetch("/api/categories?admin=true");
      if (!testRes.ok || testRes.headers.get("content-type")?.includes("text/html")) {
        isStaticMode = true;
      }
    } catch (err) {
      isStaticMode = true;
    }

    if (isStaticMode) {
      if (isEditing) {
        const updateNode = (nodes: Category[]): Category[] => {
          return nodes.map(node => {
            if (node.id === editId) {
              return { ...node, name, slug, description: description || null, image: image || null, parentId: parentId || null };
            }
            if (node.subcategories && node.subcategories.length > 0) {
              return { ...node, subcategories: updateNode(node.subcategories) };
            }
            return node;
          });
        };
        setCategories(updateNode(categories));
        setSuccess(`Category "${name}" updated (Static simulation)`);
      } else {
        const newCat: Category = {
          id: `mock-cat-${Date.now()}`,
          name,
          slug,
          description: description || null,
          image: image || null,
          isActive: true,
          parentId: parentId || null,
          subcategories: []
        };
        if (parentId) {
          const nestNode = (nodes: Category[]): Category[] => {
            return nodes.map(node => {
              if (node.id === parentId) {
                return { ...node, subcategories: [...node.subcategories, newCat] };
              }
              if (node.subcategories && node.subcategories.length > 0) {
                return { ...node, subcategories: nestNode(node.subcategories) };
              }
              return node;
            });
          };
          setCategories(nestNode(categories));
        } else {
          setCategories([...categories, newCat]);
        }
        setSuccess(`Category "${name}" created (Static simulation)`);
      }
      resetForm();
      return;
    }

    try {
      const endpoint = "/api/admin/categories";
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save category");

      setSuccess(`Category "${data.name}" ${isEditing ? "updated" : "added"} successfully.`);
      resetForm();
      fetchCategories();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEditClick = (cat: Category) => {
    setIsEditing(true);
    setEditId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setImage(cat.image || "");
    setParentId(cat.parentId || "");
  };

  const handleToggleActive = async (cat: Category) => {
    setError(null);
    setSuccess(null);

    let isStaticMode = false;
    try {
      const testRes = await fetch("/api/categories?admin=true");
      if (!testRes.ok || testRes.headers.get("content-type")?.includes("text/html")) {
        isStaticMode = true;
      }
    } catch (err) {
      isStaticMode = true;
    }

    if (isStaticMode) {
      const toggleNode = (nodes: Category[]): Category[] => {
        return nodes.map(node => {
          if (node.id === cat.id) {
            return { ...node, isActive: !node.isActive };
          }
          if (node.subcategories && node.subcategories.length > 0) {
            return { ...node, subcategories: toggleNode(node.subcategories) };
          }
          return node;
        });
      };
      setCategories(toggleNode(categories));
      setSuccess("Category status updated (Static simulation).");
      return;
    }

    try {
      const res = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cat.id, isActive: !cat.isActive })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update category status");

      setSuccess("Category status updated.");
      fetchCategories();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Category?")) return;
    setError(null);
    setSuccess(null);

    let isStaticMode = false;
    try {
      const testRes = await fetch("/api/categories?admin=true");
      if (!testRes.ok || testRes.headers.get("content-type")?.includes("text/html")) {
        isStaticMode = true;
      }
    } catch (err) {
      isStaticMode = true;
    }

    if (isStaticMode) {
      const removeNode = (nodes: Category[]): Category[] => {
        return nodes
          .filter(node => node.id !== id)
          .map(node => {
            if (node.subcategories && node.subcategories.length > 0) {
              return { ...node, subcategories: removeNode(node.subcategories) };
            }
            return node;
          });
      };
      setCategories(removeNode(categories));
      setSuccess("Category deleted (Static simulation).");
      return;
    }

    try {
      const res = await fetch("/api/admin/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete category");

      setSuccess("Category deleted successfully.");
      fetchCategories();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Helper to flat list categories for parent dropdown (excluding the one being edited to avoid loop cycles)
  const getParentDropdownOptions = (nodes: Category[], depth = 0): { id: string; name: string }[] => {
    let list: { id: string; name: string }[] = [];
    nodes.forEach(cat => {
      if (editId && cat.id === editId) return; // Prevent picking self as parent
      list.push({ id: cat.id, name: `${"─ ".repeat(depth)}${cat.name}` });
      if (cat.subcategories && cat.subcategories.length > 0) {
        list = [...list, ...getParentDropdownOptions(cat.subcategories, depth + 1)];
      }
    });
    return list;
  };

  // Render hierarchical structure
  const renderCategoryRow = (cat: Category, depth = 0) => {
    return (
      <React.Fragment key={cat.id}>
        <div className="flex items-center justify-between p-4 bg-[#FDFBF7] border border-gray-100 hover:bg-gray-50/50 transition-all rounded-xl shadow-sm">
          <div className="flex items-center gap-3" style={{ paddingLeft: `${depth * 24}px` }}>
            {depth > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
            <div className={`p-2 rounded-lg ${depth === 0 ? "bg-[#FAF5EE] text-[#B56D3E]" : "bg-gray-100 text-gray-500"}`}>
              <Folder className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-sm text-[#3D1E16]">{cat.name}</span>
              <span className="ml-2 text-xs bg-gray-100 text-gray-500 font-mono px-2 py-0.5 rounded">
                {cat.slug}
              </span>
              {cat.description && (
                <p className="text-xs text-gray-400 mt-0.5 max-w-md line-clamp-1">
                  {cat.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleToggleActive(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                cat.isActive
                  ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                  : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {cat.isActive ? "Active" : "Inactive"}
            </button>
            
            <button
              onClick={() => handleEditClick(cat)}
              className="p-2 text-gray-400 hover:text-[#3D1E16] transition-colors"
              title="Edit Category"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleDelete(cat.id)}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Delete Category"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {cat.subcategories && cat.subcategories.map(sub => renderCategoryRow(sub, depth + 1))}
      </React.Fragment>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF5EE] p-6 lg:p-10 text-[#2E1E1A]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#C09355]/20 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-serif text-[#3D1E16] font-bold">Category Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              Add and organize hierarchical product categories, collections, and catalog tags.
            </p>
          </div>
          <button
            onClick={fetchCategories}
            className="flex items-center gap-2 px-4 py-2 bg-[#FDFBF7] border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-sm font-semibold"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Error:</span> {error}
            </div>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-sm">
            <Check className="w-5 h-5 shrink-0" />
            <div>{success}</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT PANEL: Form */}
          <div className="lg:col-span-5 bg-[#FDFBF7] rounded-2xl border border-gray-200/80 shadow-md p-6 h-fit">
            <h2 className="text-xl font-serif text-[#3D1E16] font-semibold mb-4">
              {isEditing ? "Edit Category" : "Create New Category"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="e.g. Handloom Textiles"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20 focus:border-[#B56D3E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. handloom-textiles"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20 focus:border-[#B56D3E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  Parent Category (Optional - for Nesting)
                </label>
                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20 focus:border-[#B56D3E]"
                >
                  <option value="">None (Top Level Root)</option>
                  {getParentDropdownOptions(categories).map(opt => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter details about this heritage craft category..."
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20 focus:border-[#B56D3E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  Category Cover Image URL
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20 focus:border-[#B56D3E]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all text-sm font-semibold"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white rounded-xl shadow-md hover:shadow-lg transition-all text-sm font-semibold"
                >
                  {isEditing ? "Save Changes" : <><Plus className="w-4 h-4" /> Create Category</>}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT PANEL: Nested Categories Tree */}
          <div className="lg:col-span-7 bg-[#FDFBF7] rounded-2xl border border-gray-200/80 shadow-md p-6">
            <h2 className="text-xl font-serif text-[#3D1E16] font-semibold mb-4">Hierarchical Category Map</h2>

            {loading && categories.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">Loading categories...</div>
            ) : categories.length === 0 ? (
              <div className="p-8 text-center text-gray-400 border border-dashed border-gray-200 rounded-2xl text-sm">
                No categories configured. Create your first category in the left panel.
              </div>
            ) : (
              <div className="space-y-3">
                {categories.map(cat => renderCategoryRow(cat, 0))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
