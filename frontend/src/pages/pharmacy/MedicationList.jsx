import { useState, useEffect } from 'react';
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

    if (loading && medications.length === 0) return <div className="p-8 text-center text-gray-500">Loading medications...</div>;

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 sm:mb-0">Medication Inventory</h3>
                
                <div className="flex w-full sm:w-auto space-x-3">
                    <form onSubmit={handleSearch} className="flex relative w-full sm:w-64">
                        <input
                            type="text"
                            placeholder="Search medications..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                        />
                        <button type="submit" className="absolute right-2 top-2 text-gray-400 hover:text-emerald-600">
                            🔍
                        </button>
                    </form>
                    
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-sm transition-colors whitespace-nowrap"
                    >
                        <span className="mr-2">+</span> Add New
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price ($)</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Level</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {medications.map((med) => (
                            <tr key={med.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{med.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{med.name}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={med.description}>
                                    {med.description}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ${med.price.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center justify-center space-x-3">
                                        <button 
                                            onClick={() => handleStockUpdate(med.id, med.stock, -1)}
                                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 flex items-center justify-center text-gray-600 transition-colors"
                                        >-</button>
                                        <span className={`text-sm font-bold w-8 text-center ${med.stock < 20 ? 'text-red-600' : 'text-emerald-600'}`}>
                                            {med.stock}
                                        </span>
                                        <button 
                                            onClick={() => handleStockUpdate(med.id, med.stock, 5)}
                                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-emerald-100 hover:text-emerald-600 flex items-center justify-center text-gray-600 transition-colors"
                                        >+</button>
                                    </div>
                                    {med.stock < 20 && (
                                        <div className="text-xs text-red-500 text-center mt-1 flex items-center justify-center">
                                            <span className="mr-1">⚠️</span> Low Stock
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleOpenModal(med)}
                                        className="text-blue-600 hover:text-blue-900 mr-4 transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(med.id)}
                                        className="text-red-600 hover:text-red-900 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {medications.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                    No medications found. Add some to build your inventory.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">
                                {editingMedication ? 'Edit Medication' : 'Add New Medication'}
                            </h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                                ✖
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    required
                                />
                            </div>
                            
                            <div className="flex space-x-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        required
                                        min="0"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Initial Stock</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        required
                                        min="0"
                                    />
                                </div>
                            </div>
                            
                            <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100 mt-6">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                    {editingMedication ? 'Save Changes' : 'Add Medication'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
