"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, ShieldAlert, Check, X, RefreshCw, Compass } from "lucide-react";

interface District {
  id: string;
  name: string;
  odopProduct: string | null;
  isActive: boolean;
}

interface State {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  districts: District[];
}

interface StateMapAsset {
  id: string;
  stateCode: string;
  imageUrl: string;
  imageType: string;
  fileSize: number;
  version: number;
  uploadedBy: string;
  status: string;
}

export default function AdminStatesPage() {
  const [states, setStates] = useState<State[]>([]);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [mapAssets, setMapAssets] = useState<StateMapAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingMap, setUploadingMap] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Forms
  const [stateName, setStateName] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [districtOdop, setDistrictOdop] = useState("");

  const fetchStates = async () => {
    setLoading(true);
    try {
      let isStaticMode = false;
      let data: any = null;

      try {
        const res = await fetch("/api/states?admin=true");
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
        const res = await fetch("/static-data/states.json");
        if (res.ok) {
          data = await res.json();
        }
      }

      if (data) {
        setStates(data);
        if (selectedState) {
          const updatedSelected = data.find((s: State) => s.id === selectedState.id);
          setSelectedState(updatedSelected || null);
        }

        try {
          const mapsRes = await fetch("/api/state-maps");
          if (mapsRes.ok) {
            const mapsData = await mapsRes.json();
            setMapAssets(mapsData);
          }
        } catch (mapsErr) {
          console.warn("Failed to fetch map assets list:", mapsErr);
        }
      } else {
        throw new Error("Failed to fetch states dataset");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  const handleAddState = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stateName || !stateCode) return;
    setError(null);
    setSuccess(null);

    let isStaticMode = false;
    try {
      const testRes = await fetch("/api/states?admin=true");
      if (!testRes.ok || testRes.headers.get("content-type")?.includes("text/html")) {
        isStaticMode = true;
      }
    } catch (err) {
      isStaticMode = true;
    }

    if (isStaticMode) {
      const newState: State = {
        id: `mock-state-${Date.now()}`,
        name: stateName,
        code: stateCode.toUpperCase(),
        isActive: true,
        districts: []
      };
      setStates([...states, newState]);
      setSuccess(`State "${stateName}" added (Static simulation)`);
      setStateName("");
      setStateCode("");
      return;
    }

    try {
      const res = await fetch("/api/admin/states", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "state", name: stateName, code: stateCode })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add state");

      setSuccess(`State "${data.name}" added successfully.`);
      setStateName("");
      setStateCode("");
      fetchStates();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleToggleState = async (stateId: string, currentStatus: boolean) => {
    setError(null);
    setSuccess(null);

    let isStaticMode = false;
    try {
      const testRes = await fetch("/api/states?admin=true");
      if (!testRes.ok || testRes.headers.get("content-type")?.includes("text/html")) {
        isStaticMode = true;
      }
    } catch (err) {
      isStaticMode = true;
    }

    if (isStaticMode) {
      const updated = states.map(s => {
        if (s.id === stateId) return { ...s, isActive: !s.isActive };
        return s;
      });
      setStates(updated);
      if (selectedState?.id === stateId) {
        setSelectedState({ ...selectedState, isActive: !selectedState.isActive });
      }
      setSuccess("State status updated (Static simulation).");
      return;
    }

    try {
      const res = await fetch("/api/admin/states", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "state", id: stateId, isActive: !currentStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update state status");

      setSuccess(`State status updated successfully.`);
      fetchStates();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteState = async (stateId: string) => {
    if (!confirm("Are you sure you want to delete this State?")) return;
    setError(null);
    setSuccess(null);

    let isStaticMode = false;
    try {
      const testRes = await fetch("/api/states?admin=true");
      if (!testRes.ok || testRes.headers.get("content-type")?.includes("text/html")) {
        isStaticMode = true;
      }
    } catch (err) {
      isStaticMode = true;
    }

    if (isStaticMode) {
      setStates(states.filter(s => s.id !== stateId));
      if (selectedState?.id === stateId) setSelectedState(null);
      setSuccess("State deleted successfully (Static simulation).");
      return;
    }

    try {
      const res = await fetch("/api/admin/states", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "state", id: stateId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete state");

      setSuccess("State deleted successfully.");
      if (selectedState?.id === stateId) setSelectedState(null);
      fetchStates();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddDistrict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedState || !districtName) return;
    setError(null);
    setSuccess(null);

    let isStaticMode = false;
    try {
      const testRes = await fetch("/api/states?admin=true");
      if (!testRes.ok || testRes.headers.get("content-type")?.includes("text/html")) {
        isStaticMode = true;
      }
    } catch (err) {
      isStaticMode = true;
    }

    if (isStaticMode) {
      const newDist: District = {
        id: `mock-dist-${Date.now()}`,
        name: districtName,
        odopProduct: districtOdop || null,
        isActive: true
      };
      const updatedStates = states.map(s => {
        if (s.id === selectedState.id) {
          return { ...s, districts: [...s.districts, newDist] };
        }
        return s;
      });
      setStates(updatedStates);
      setSelectedState({ ...selectedState, districts: [...selectedState.districts, newDist] });
      setSuccess(`District "${districtName}" added to ${selectedState.name} (Static simulation).`);
      setDistrictName("");
      setDistrictOdop("");
      return;
    }

    try {
      const res = await fetch("/api/admin/states", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "district",
          stateId: selectedState.id,
          name: districtName,
          odopProduct: districtOdop || null
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add district");

      setSuccess(`District "${data.name}" added successfully to ${selectedState.name}.`);
      setDistrictName("");
      setDistrictOdop("");
      fetchStates();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleToggleDistrict = async (districtId: string, currentStatus: boolean) => {
    setError(null);
    setSuccess(null);

    let isStaticMode = false;
    try {
      const testRes = await fetch("/api/states?admin=true");
      if (!testRes.ok || testRes.headers.get("content-type")?.includes("text/html")) {
        isStaticMode = true;
      }
    } catch (err) {
      isStaticMode = true;
    }

    if (isStaticMode) {
      const toggleDistInState = (districtsList: District[]) => {
        return districtsList.map(d => {
          if (d.id === districtId) return { ...d, isActive: !d.isActive };
          return d;
        });
      };
      const updatedStates = states.map(s => {
        return { ...s, districts: toggleDistInState(s.districts) };
      });
      setStates(updatedStates);
      if (selectedState) {
        setSelectedState({ ...selectedState, districts: toggleDistInState(selectedState.districts) });
      }
      setSuccess("District status updated (Static simulation).");
      return;
    }

    try {
      const res = await fetch("/api/admin/states", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "district", id: districtId, isActive: !currentStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update district status");

      setSuccess(`District status updated successfully.`);
      fetchStates();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteDistrict = async (districtId: string) => {
    if (!confirm("Are you sure you want to delete this District?")) return;
    setError(null);
    setSuccess(null);

    let isStaticMode = false;
    try {
      const testRes = await fetch("/api/states?admin=true");
      if (!testRes.ok || testRes.headers.get("content-type")?.includes("text/html")) {
        isStaticMode = true;
      }
    } catch (err) {
      isStaticMode = true;
    }

    if (isStaticMode) {
      const removeDist = (districtsList: District[]) => districtsList.filter(d => d.id !== districtId);
      const updatedStates = states.map(s => {
        return { ...s, districts: removeDist(s.districts) };
      });
      setStates(updatedStates);
      if (selectedState) {
        setSelectedState({ ...selectedState, districts: removeDist(selectedState.districts) });
      }
      setSuccess("District deleted successfully (Static simulation).");
      return;
    }

    try {
      const res = await fetch("/api/admin/states", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "district", id: districtId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete district");

      setSuccess("District deleted successfully.");
      fetchStates();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUploadMap = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedState) return;

    setError(null);
    setSuccess(null);
    setUploadingMap(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("stateCode", selectedState.code);
    formData.append("stateName", selectedState.name);

    try {
      const res = await fetch("/api/state-maps", {
        method: "POST",
        headers: {
          "x-mock-role": "Super Admin"
        },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload map asset");

      setSuccess(`Map for ${selectedState.name} uploaded and configured successfully!`);
      fetchStates();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploadingMap(false);
      e.target.value = "";
    }
  };

  const handleDeleteMap = async (assetId: string) => {
    if (!selectedState) return;
    if (!confirm("Are you sure you want to delete this state map asset?")) return;

    setError(null);
    setSuccess(null);
    setUploadingMap(true);

    try {
      const res = await fetch(`/api/state-maps/${assetId}`, {
        method: "DELETE",
        headers: {
          "x-mock-role": "Super Admin"
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete map asset");

      setSuccess(`Map for ${selectedState.name} deleted successfully.`);
      fetchStates();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploadingMap(false);
    }
  };

  const handleRestoreDefault = async () => {
    if (!confirm("Are you sure you want to restore all default map assets? This will overwrite existing files and reset database mappings.")) return;

    setError(null);
    setSuccess(null);
    setUploadingMap(true);

    try {
      const res = await fetch("/api/state-maps/restore-default", {
        method: "POST",
        headers: {
          "x-mock-role": "Super Admin"
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to restore defaults");

      setSuccess("Successfully restored all default state map outlines!");
      fetchStates();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploadingMap(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF5EE] p-6 lg:p-10 text-[#2E1E1A]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#C09355]/20 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-serif text-[#3D1E16] font-bold">State & District Administration</h1>
            <p className="text-sm text-gray-550 mt-1">
              Configure and activate Indian States, Union Territories, and corresponding ODOP Districts.
            </p>
          </div>
          <button
            onClick={fetchStates}
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
          
          {/* LEFT PANEL: States CRUD */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#FDFBF7] rounded-2xl border border-gray-200/80 shadow-md p-6">
              <h2 className="text-xl font-serif text-[#3D1E16] font-semibold mb-4">Add State / UT</h2>
              <form onSubmit={handleAddState} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    State / UT Name
                  </label>
                  <input
                    type="text"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="e.g. Uttar Pradesh"
                    className="w-full px-4 py-2.5 bg-gray-55 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20 focus:border-[#B56D3E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    State Code (Abbreviation)
                  </label>
                  <input
                    type="text"
                    value={stateCode}
                    onChange={(e) => setStateCode(e.target.value)}
                    placeholder="e.g. UP"
                    maxLength={3}
                    className="w-full px-4 py-2.5 bg-gray-55 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20 focus:border-[#B56D3E]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white rounded-xl shadow-md hover:shadow-lg transition-all text-sm font-semibold"
                >
                  <Plus className="w-4 h-4" /> Add State / UT
                </button>
              </form>
            </div>

            {/* States List */}
            <div className="bg-[#FDFBF7] rounded-2xl border border-gray-200/80 shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-serif text-[#3D1E16] font-semibold">States & UTs ({states.length})</h2>
              </div>
              
              {loading && states.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">Loading states data...</div>
              ) : (
                <div className="divide-y divide-gray-100 max-h-[450px] overflow-y-auto">
                  {states.map((state) => (
                    <div
                      key={state.id}
                      onClick={() => setSelectedState(state)}
                      className={`p-4 flex items-center justify-between cursor-pointer transition-all ${
                        selectedState?.id === state.id ? "bg-[#FAF5EE]/40 border-l-4 border-[#B56D3E]" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="font-semibold text-sm text-[#3D1E16]">{state.name}</span>
                        <span className="ml-2 text-xs bg-gray-100 text-gray-655 px-2 py-0.5 rounded font-mono uppercase">
                          {state.code}
                        </span>
                        <div className="text-xs text-gray-400">
                          {state.districts.length} District(s) configured
                        </div>
                      </div>
                      
                      {/* Controls */}
                      <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleToggleState(state.id, state.isActive)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                            state.isActive
                              ? "bg-green-55/10 text-green-700 border-green-200 hover:bg-green-100"
                              : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                          }`}
                        >
                          {state.isActive ? "Active" : "Inactive"}
                        </button>
                        
                        <button
                          onClick={() => handleDeleteState(state.id)}
                          className="p-2 text-gray-400 hover:text-red-655 transition-colors"
                          title="Delete State"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: Districts CRUD for Selected State */}
          <div className="lg:col-span-7">
            {selectedState ? (
              <div className="space-y-6">
                
                {/* Region Map Manager Block */}
                <div className="bg-[#FDFBF7] rounded-2xl border border-gray-200/80 shadow-md p-6">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                    <div>
                      <h3 className="text-base font-serif text-[#3D1E16] font-bold">
                        Region Map Asset
                      </h3>
                      <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                        Real-time Vector Outline Silhouette
                      </p>
                    </div>
                    {mapAssets.find(m => m.stateCode.toUpperCase() === selectedState.code.toUpperCase()) && (
                      <span className="text-[10px] font-bold text-[#B56D3E] bg-[#B56D3E]/5 px-2.5 py-0.5 rounded-full uppercase">
                        Version {mapAssets.find(m => m.stateCode.toUpperCase() === selectedState.code.toUpperCase())?.version}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Map Preview Frame */}
                    <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-[#FAF5EE]/50 rounded-2xl border border-[#C09355]/20 h-40 relative group overflow-hidden">
                      <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#C09355_1px,transparent_1px),linear-gradient(to_bottom,#C09355_1px,transparent_1px)] bg-[size:10px_10px]" />
                      
                      {mapAssets.find(m => m.stateCode.toUpperCase() === selectedState.code.toUpperCase()) ? (
                        <>
                          <img 
                            src={mapAssets.find(m => m.stateCode.toUpperCase() === selectedState.code.toUpperCase())?.imageUrl} 
                            alt={`${selectedState.name} map`} 
                            className="w-24 h-24 object-contain transition-transform group-hover:scale-105 duration-300"
                            style={{ filter: "sepia(0.8) hue-rotate(-15deg) saturate(2.5) brightness(0.8)" }}
                          />
                          <span className="absolute bottom-2 text-[8px] font-mono text-gray-400">
                            {mapAssets.find(m => m.stateCode.toUpperCase() === selectedState.code.toUpperCase())?.imageType} ({Math.round((mapAssets.find(m => m.stateCode.toUpperCase() === selectedState.code.toUpperCase())?.fileSize || 0) / 1024)} KB)
                          </span>
                        </>
                      ) : (
                        <div className="text-center text-xs text-gray-400">
                          <Compass className="w-8 h-8 mx-auto text-gray-300 mb-2 animate-pulse" />
                          No Map Configured
                        </div>
                      )}
                    </div>

                    {/* Map Controls */}
                    <div className="md:col-span-8 space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          Upload / Replace Vector Map
                        </label>
                        <input 
                          type="file"
                          accept=".svg,.png,.webp"
                          onChange={handleUploadMap}
                          disabled={uploadingMap}
                          className="block w-full text-xs text-gray-550
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-xl file:border-0
                            file:text-xs file:font-semibold
                            file:bg-[#FAF5EE] file:text-[#B56D3E]
                            hover:file:bg-[#FAF5EE]/80 file:cursor-pointer"
                        />
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {mapAssets.find(m => m.stateCode.toUpperCase() === selectedState.code.toUpperCase()) && (
                          <button
                            onClick={() => handleDeleteMap(mapAssets.find(m => m.stateCode.toUpperCase() === selectedState.code.toUpperCase())!.id)}
                            disabled={uploadingMap}
                            className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition-all"
                          >
                            Delete Map
                          </button>
                        )}
                        <button
                          onClick={handleRestoreDefault}
                          disabled={uploadingMap}
                          className="px-3.5 py-2 bg-[#FAF5EE] hover:bg-amber-500/5 text-[#B56D3E] border border-[#C09355]/20 rounded-xl text-xs font-bold transition-all"
                        >
                          Restore Default
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Add District form */}
                <div className="bg-[#FDFBF7] rounded-2xl border border-gray-200/80 shadow-md p-6">
                  <h2 className="text-xl font-serif text-[#3D1E16] font-semibold mb-1">
                    Manage Districts for {selectedState.name}
                  </h2>
                  <p className="text-xs text-gray-555 mb-4 font-semibold uppercase font-mono">
                    State Code: {selectedState.code}
                  </p>
                  
                  <form onSubmit={handleAddDistrict} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        District Name
                      </label>
                      <input
                        type="text"
                        value={districtName}
                        onChange={(e) => setDistrictName(e.target.value)}
                        placeholder="e.g. Varanasi"
                        className="w-full px-4 py-2 bg-gray-55 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20 focus:border-[#B56D3E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-555 uppercase tracking-wider mb-1">
                        ODOP Product Title
                      </label>
                      <input
                        type="text"
                        value={districtOdop}
                        onChange={(e) => setDistrictOdop(e.target.value)}
                        placeholder="e.g. Banarasi Silk Saree"
                        className="w-full px-4 py-2 bg-gray-55 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20 focus:border-[#B56D3E]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-[#3D1E16] hover:bg-[#28140E] text-white rounded-xl shadow-md transition-all text-sm font-semibold"
                      >
                        <Plus className="w-4 h-4" /> Add District to {selectedState.name}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Districts List */}
                <div className="bg-[#FDFBF7] rounded-2xl border border-gray-200/80 shadow-md p-6">
                  <h3 className="text-lg font-serif text-[#3D1E16] font-semibold mb-4">
                    Configured Districts in {selectedState.name} ({selectedState.districts.length})
                  </h3>

                  {selectedState.districts.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 border border-dashed border-gray-200 rounded-2xl text-sm">
                      No districts configured yet. Add a district using the form above.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                            <th className="pb-3">District Name</th>
                            <th className="pb-3">ODOP Product</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {selectedState.districts.map((dist) => (
                            <tr key={dist.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="py-3.5 font-semibold text-[#3D1E16]">{dist.name}</td>
                              <td className="py-3.5 text-gray-600">
                                {dist.odopProduct ? (
                                  <span className="bg-[#FAF5EE] text-[#B56D3E] border border-[#C09355]/20 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                                    {dist.odopProduct}
                                  </span>
                                ) : (
                                  <span className="text-gray-400 italic text-xs">None configured</span>
                                )}
                              </td>
                              <td className="py-3.5">
                                <button
                                  onClick={() => handleToggleDistrict(dist.id, dist.isActive)}
                                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                                    dist.isActive
                                      ? "bg-green-55/10 text-green-700 border-green-200 hover:bg-green-100"
                                      : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                                  }`}
                                >
                                  {dist.isActive ? "Active" : "Inactive"}
                                </button>
                              </td>
                              <td className="py-3.5 text-right">
                                <button
                                  onClick={() => handleDeleteDistrict(dist.id)}
                                  className="p-1.5 text-gray-400 hover:text-red-655 transition-colors"
                                  title="Delete District"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="h-[400px] bg-[#FDFBF7] rounded-2xl border border-dashed border-gray-200 shadow-sm flex flex-col items-center justify-center text-center p-6">
                <div className="w-12 h-12 bg-[#FAF5EE] border border-[#C09355]/20 rounded-full flex items-center justify-center text-[#B56D3E] mb-4 font-serif text-lg font-bold">
                  i
                </div>
                <h3 className="text-lg font-serif text-[#3D1E16] font-semibold">No State Selected</h3>
                <p className="text-sm text-gray-400 max-w-sm mt-1">
                  Select an Indian State or Union Territory from the left panel to inspect and configure its ODOP districts.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
