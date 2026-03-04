import { useState, useEffect } from 'react';
import pharmacyService from '../../services/pharmacyService';

export default function PrescriptionList({ refreshStats }) {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'pending', 'dispensed'
    const [patientSearch, setPatientSearch] = useState('');

    useEffect(() => {
        loadPrescriptions();
    }, [filter]);

    const loadPrescriptions = async () => {
        setLoading(true);
        try {
            let data = [];
            if (patientSearch) {
                if (filter === 'pending') {
                    data = await pharmacyService.getPendingPrescriptions(patientSearch);
                } else {
                    data = await pharmacyService.getPrescriptionsByPatient(patientSearch);
                }
            } else {
                data = await pharmacyService.getPrescriptions();
                if (filter === 'pending') {
                    data = data.filter(p => !p.dispensed);
                } else if (filter === 'dispensed') {
                    data = data.filter(p => p.dispensed);
                }
            }
            // Sort by date descending
            data.sort((a, b) => new Date(b.prescribedDate) - new Date(a.prescribedDate));
            setPrescriptions(data);
            if (refreshStats) refreshStats();
        } catch (error) {
            console.error("Failed to load prescriptions", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        loadPrescriptions();
    };

    const handleDispense = async (id) => {
        if (window.confirm("Confirm dispensing medications for this prescription? This will deduct from stock.")) {
            try {
                await pharmacyService.dispensePrescription(id);
                await loadPrescriptions();
                alert("Prescription dispensed successfully!");
            } catch (error) {
                console.error("Failed to dispense", error);
                const msg = error.response?.data?.message || "Error dispensing. Please check stock levels.";
                alert(msg);
            }
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 sm:mb-0">Prescription Queue</h3>
                
                <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="flex rounded-lg border border-gray-300 overflow-hidden bg-gray-50">
                        <button 
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 text-sm font-medium ${filter === 'all' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            All
                        </button>
                        <button 
                            onClick={() => setFilter('pending')}
                            className={`px-4 py-2 text-sm font-medium border-l border-gray-300 ${filter === 'pending' ? 'bg-yellow-500 text-white border-yellow-500' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            Pending
                        </button>
                        <button 
                            onClick={() => setFilter('dispensed')}
                            className={`px-4 py-2 text-sm font-medium border-l border-gray-300 ${filter === 'dispensed' ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            Dispensed
                        </button>
                    </div>

                    <form onSubmit={handleSearch} className="flex relative w-full sm:w-64">
                        <input
                            type="text"
                            placeholder="Patient ID..."
                            value={patientSearch}
                            onChange={(e) => setPatientSearch(e.target.value)}
                            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                        />
                        <button type="submit" className="absolute right-2 top-2 text-gray-400 hover:text-emerald-600">
                            🔍
                        </button>
                    </form>
                </div>
            </div>

            {loading ? (
                <div className="p-8 text-center text-gray-500">Loading prescriptions...</div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {prescriptions.map((prescription) => (
                        <div 
                            key={prescription.id} 
                            className={`bg-white rounded-xl border p-5 shadow-sm transition-shadow hover:shadow-md ${
                                prescription.dispensed ? 'border-l-4 border-l-blue-500' : 'border-l-4 border-l-yellow-500'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <h4 className="text-lg font-bold text-gray-900">RX #{prescription.id}</h4>
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            prescription.dispensed ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {prescription.dispensed ? 'DISPENSED' : 'PENDING'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Date: {new Date(prescription.prescribedDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full text-gray-700 inline-block mb-1">
                                        Patient: {prescription.patientId}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Doc: {prescription.doctorId}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-100">
                                <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Prescribed Medications</h5>
                                <ul className="space-y-2">
                                    {prescription.medications && prescription.medications.map((med, idx) => (
                                        <li key={idx} className="flex justify-between text-sm">
                                            <span className="font-medium text-gray-800">{med.medicationName || `Medication ID: ${med.id}`}</span>
                                            <span className="text-gray-600 bg-white px-2 py-0.5 rounded border border-gray-200">Qty: {med.quantity}</span>
                                        </li>
                                    ))}
                                    {(!prescription.medications || prescription.medications.length === 0) && (
                                        <li className="text-sm text-gray-500 italic">No medications listed.</li>
                                    )}
                                </ul>
                            </div>

                            <div className="flex justify-end mt-2">
                                {!prescription.dispensed ? (
                                    <button
                                        onClick={() => handleDispense(prescription.id)}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center"
                                    >
                                        <span className="mr-2">✓</span> Dispense Order
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        className="bg-gray-100 text-gray-400 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed flex items-center border border-gray-200"
                                    >
                                        <span className="mr-2">🔒</span> Completed
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {prescriptions.length === 0 && (
                        <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            No prescriptions found matching the current criteria.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
