import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import pharmacyService from '../../services/pharmacyService';

export default function MedicationList({ refreshStats }) {
    const [medications, setMedications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMedication, setEditingMedication] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', stock: 0, price: 0 });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadMedications();
    }, []);

    const loadMedications = async () => {
        setLoading(true);
        try {
            const data = await pharmacyService.getMedications();
            setMedications(data);
            if (refreshStats) refreshStats();
        } catch (error) {
            console.error("Failed to load medications", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (searchTerm.trim() === '') {
                await loadMedications();
            } else {
                const data = await pharmacyService.searchMedications(searchTerm);
                setMedications(data);
            }
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (medication = null) => {
        if (medication) {
            setEditingMedication(medication);
            setFormData({ ...medication });
        } else {
            setEditingMedication(null);
            setFormData({ name: '', description: '', stock: 0, price: 0 });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingMedication(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'stock' ? parseInt(value) || 0 : name === 'price' ? parseFloat(value) || 0 : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingMedication) {
                await pharmacyService.updateMedication(editingMedication.id, formData);
            } else {
                await pharmacyService.addMedication(formData);
            }
            await loadMedications();
            handleCloseModal();
        } catch (error) {
            console.error("Failed to save medication", error);
            alert("Error saving medication. Please try again.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this medication?")) {
            try {
                await pharmacyService.deleteMedication(id);
                await loadMedications();
            } catch (error) {
                console.error("Failed to delete", error);
                alert("Error deleting medication.");
            }
        }
    };

    const handleStockUpdate = async (id, currentStock, change) => {
        try {
            await pharmacyService.updateStock(id, change);
            await loadMedications();
        } catch (error) {
            console.error("Stock update failed", error);
        }
    };

    if (loading && medications.length === 0) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>⏳ Loading medications...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Medication Inventory</h3>
                
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
                        <input
                            type="text"
                            placeholder="Search medications..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field"
                            style={{ minWidth: '250px' }}
                        />
                        <button type="submit" className="btn btn-outline" title="Search">
                            🔍
                        </button>
                    </form>
                    
                    <button
                        onClick={() => handleOpenModal()}
                        className="btn btn-primary"
                    >
                        + Add New
                    </button>
                </div>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price ($)</th>
                            <th style={{ textAlign: 'center' }}>Stock Level</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medications.map((med) => (
                            <tr key={med.id}>
                                <td className="text-muted text-xs">#{med.id}</td>
                                <td style={{ fontWeight: 600 }}>{med.name}</td>
                                <td className="text-muted" style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={med.description}>
                                    {med.description}
                                </td>
                                <td>${med.price.toFixed(2)}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: 'var(--off-white)', padding: '4px 8px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border)' }}>
                                        <button 
                                            onClick={() => handleStockUpdate(med.id, med.stock, -1)}
                                            style={{ border: 'none', background: '#fff', width: '24px', height: '24px', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >-</button>
                                        <span className={`status ${med.stock < 20 ? 'danger' : 'success'}`} style={{ minWidth: '40px' }}>
                                            {med.stock}
                                        </span>
                                        <button 
                                            onClick={() => handleStockUpdate(med.id, med.stock, 5)}
                                            style={{ border: 'none', background: '#fff', width: '24px', height: '24px', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >+</button>
                                    </div>
                                    {med.stock < 20 && (
                                        <div style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '4px', fontWeight: 600 }}>
                                            ⚠️ Low Stock
                                        </div>
                                    )}
                                </td>
                                <td style={{ textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                    <button
                                        onClick={() => handleOpenModal(med)}
                                        className="btn btn-sm btn-outline"
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(med.id)}
                                        className="btn btn-sm btn-danger"
                                    >
                                        🗑️ Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {medications.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-tertiary)' }}>
                                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💊</div>
                                    No medications found. Add some to build your inventory.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Form Modal */}
            {isModalOpen && createPortal(
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>
                                {editingMedication ? '✏️ Edit Medication' : '+ Add New Medication'}
                            </h2>
                            <button onClick={handleCloseModal} className="modal-close">✖</button>
                        </div>
                        
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="form-group">
                                <label>Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input-field"
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="3"
                                    style={{ resize: 'vertical' }}
                                    className="input-field"
                                    required
                                />
                            </div>
                            
                            <div className="grid-2">
                                <div className="form-group">
                                    <label>Price ($) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="input-field"
                                        required
                                        min="0"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Initial Stock *</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        className="input-field"
                                        required
                                        min="0"
                                    />
                                </div>
                            </div>
                            
                            <div className="modal-footer" style={{ marginTop: '24px' }}>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="btn btn-outline"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    {editingMedication ? 'Save Changes' : 'Add Medication'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
