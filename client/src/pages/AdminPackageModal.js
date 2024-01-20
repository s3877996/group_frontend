import React, {useState, useEffect} from "react";
import AdminNavBar from "../components/Navigation/AdminNavBar";
import { useNavigate, useParams } from "react-router-dom";
import { toast, Toaster} from 'react-hot-toast';

import api from "../api";

const AdminPackageModal = () => {
    const { packageId } = useParams();
    console.log("id", packageId);

    const [isModalOpen, setModalOpen] = useState(false);
    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const navigate = useNavigate();
    const [packageData, setPackageData] = useState({
        package_name: '',
        package_period: '',
        thumbnail: '',
        limited_docs: '',
        package_price: '',
        package_description: ''
    });

    const [name, setName] = useState('');
    const [period, setPeriod] = useState('');
    const [docs, setDocs] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [thumbnail, setThumbnail] = useState('');


    // fetch package info
    useEffect(() => {
        api.get(`/admin/get_package/${packageId}`) // Assuming this is backend endpoint
            .then(response => {
                console.log(response.data)
                setPackageData(response.data)
                setName(response.data.package_name)
                setPeriod(response.data.package_period)
                setDocs(response.data.limited_docs)
                setPrice(response.data.package_price)
                setDescription(response.data.package_description)
                setThumbnail(response.data.thumbnail)
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });

    }, [packageId]);

    //update package name
    const handleChangePackage= async () => {
        try {
            // Validate price
            if (!price || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
                toast.error("Please enter a valid price.", {
                    duration: 3000,
                });
                return;
            }

            // Validate docs
            if (!docs || isNaN(parseInt(docs)) || parseInt(docs) <= 0) {
                toast.error("Please enter a valid number of docs.", {
                    duration: 3000,
                });
                return;
            }

            // Validate package period
            const periodRegex = /^((1?[1-9]|[12]\d|30)\s+days|([1-9]|1[0-2])\s+months?)$/; // Regex for "number + days" or "number + months"
            if (!period || !periodRegex.test(period.trim())) {
                toast.error("Please enter a valid package period (e.g., '5 days' or '1 month').\nFor days, the number should be between 1 and 30. For months, the number should be between 1 and 12.", {
                    duration: 3000,
                });
                return;
            }

            // Make API request to update password
            const response = await api.put(`/admin/update_package/${packageId}`, {
                package_name: name,
                package_period: period,
                limited_docs: docs,
                package_price: price,
                package_description: description,
                thumbnail: thumbnail,
            }, [packageId, navigate]);

            // Handle success, show a success message
            console.log(response.data);

            // Display a success toast, with a title
            toast.success("Update Package details successful!", {
                duration: 3000,
            });

            //Navigate to previous page
             navigate('/admin/packages');
        } catch (error) {
            // Handle error, show an error message
            console.error('Error updating password:', error.response.data.message);
            // Display an error toast, with a title
            toast.error(`Updating failed: ${error.response.data.message || 'Unknown error'}`, {
                duration: 3000,
            });
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <AdminNavBar/>

            <main className="pt-24 flex items-center justify-center h-full overflow-auto">
                <div className="container mx-auto mt-32">
                    <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
                        <h2 className="text-2xl font-bold pt-32 text-center">Package Information</h2>

                        <div className="flex justify-center items-center">
                            <img
                                src={packageData.thumbnail}
                                alt={packageData.package_name}
                                className="h-20 w-20"
                            />
                        </div>

                        <div className="space-y-2">
                            <p>
                                <strong>Package Thumbnail:</strong> {packageData.thumbnail}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold mb-2">Change Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-600">
                                        Package Name:
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="mt-1 p-2 w-full border rounded-md"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                            {/* ... (Repeat the structure for other input fields) ... */}
                            <div>
                                <label htmlFor="period" className="block text-sm font-medium text-gray-600">
                                    Package Period:
                                </label>
                                <input
                                    type="text"
                                    id="period"
                                    className="mt-1 p-2 w-full border rounded-md"
                                    value={period}
                                    onChange={(e) => setPeriod(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-600">
                                    Thumbnail:
                                </label>
                                <input
                                    type="text"
                                    id="thumbnail"
                                    className="mt-1 p-2 w-full border rounded-md"
                                    placeholder="Paste the thumbnail link here..."
                                    value={thumbnail}
                                    onChange={(e) => setThumbnail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="docs" className="block text-sm font-medium text-gray-600">
                                    Number of limited docs:
                                </label>
                                <input
                                    type="number"
                                    id="docs"
                                    className="mt-1 p-2 w-full border rounded-md"
                                    placeholder="Paste the thumbnail link here..."
                                    value={docs}
                                    onChange={(e) => setDocs(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-600">
                                    Price:
                                </label>
                                <input
                                    type="float"
                                    id="price"
                                    className="mt-1 p-2 w-full border rounded-md"
                                    placeholder="e.g., 2.99"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-600">
                                    Description:
                                </label>
                                <input
                                    type="text"
                                    id="description"
                                    className="mt-1 p-2 w-full border rounded-md"
                                    placeholder="Paste the description of the product"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>


                                <button
                                    className="w-full bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-800 mt-4"
                                    onClick={handleChangePackage}
                                >
                                    Change Package Information
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};


export default AdminPackageModal;



