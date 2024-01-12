import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const PackageTable = () => {
    const [packageData, setPackageData] = useState([]);

    const navigate = useNavigate();

    const handleEditPackageInfo = (packageId) => {
        navigate(`/admin/packages/edit/${packageId}`);
    }

    useEffect(() => {
        api.get('/admin/get_all_packages')
            .then(response => {
                console.log("package data:", response.data);
                setPackageData(response.data);
            })
            .catch(err => {
                console.log('Error fetching user info for admin page: ', err);
            });
    }, []);

    return (
        <div className="mt-24 w-full min-w-max table-auto text-center">
            <table className="w-full text-sm text-center rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-white-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">Package Name</th>
                        <th scope="col" className="px-6 py-3">Period</th>
                        <th scope="col" className="px-6 py-3">No. Documents</th>
                        <th scope="col" className="px-6 py-3">Price</th>
                        <th scope="col" className="px-6 py-3">Description</th>
                        <th scope="col" className="px-6 py-3"></th>
                    </tr>
                </thead>
                <tbody>
                {packageData.map((pkg) => (
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={pkg.id}>
                        <td className="px-6 py-4 place-content-center">
                            <img
                                src={pkg.thumbnail}
                                alt={pkg.package_name}
                                className="h-16 w-16"
                            />
                            <p className="pt-2 font-bold justify-items-center">{pkg.package_name}</p>
                        </td>
                        <td className="px-6 py-4">
                            {pkg.package_period}
                        </td>
                        <td className="px-6 py-4">
                            {pkg.limited_docs}
                        </td>
                        <td className="px-6 py-4">
                            {pkg.package_price}
                        </td>
                        <td className="px-6 py-4 text-wrap">
                            <p className="text-wrap">{pkg.package_description}</p> 
                        </td>
                        <td className="px-6 py-4 text-wrap">
                            <button type="button" onClick={() => handleEditPackageInfo(pkg.id)}>
                                <svg class="h-6 w-6 text-gray-500"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                                </svg>
                            </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div> 
    )
};

export default PackageTable;