import React, {useState, useEffect} from "react";
import basic from "../image/basic.png";
import standard from "../image/standard.jpeg";
import premium from "../image/premium.jpg";
import Navbar from "../components/Navigation/Navbar";
import FileRender from "../components/FileRender/FileRender";
// import firebase from "../firebase/firebaseConfig";
import PaymentHistoryTable from './PaymentHistoryTable'
import api from '../api';

const SubscriptionPage = () => {
    const [userId, setUserId] = useState("");
    const [userName, setUserName] = useState("");
    const [planType, setPlanType] = useState("");
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({

    });
    const [subscription, setSubscription] = useState([]);
    const [apiLink, setApiLink] = useState(null);
    const payment= async (e,itemId)=>{
        setLoading(true);
        const response = await api.post('/api/payments/create-payment-link',{
            package_id:itemId
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const data = response.data;
          const link = data.link;
          setApiLink(link);
          setLoading(false);
          // Open the link in a new window/tab
          window.open(link, '_self');
    }
    useEffect(() => {
        api.get('/api/packages')
            .then(response => {
              console.log(response.data)
              setSubscription(response.data);
            })
            .catch(error => {
              console.error('Error fetching user data:', error);
            });

            api.get('/api/users/me') // Assuming this is backend endpoint
            .then(response => {
                console.log(response.data)
                setPlanType(response.data.data.package_id);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });


      }, []);
    return (

        <div className="flex flex-col ">
            <main className="flex-grow bg-white-700 overflow-auto">
                <div className="mx-auto max-w-screen-xl h-full w-full">
                    <Navbar/>
                </div>
                <div
                    className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 z-50 place-items-center w-9/12 mx-auto mt-20">
                    {subscription.map((item, idx) => (
                        <div key={idx}
                             className={`bg-white px-6 py-8 rounded-xl text-[#4f7cff] w-full mx-auto grid place-items-center ${planType === item.id && "border-[16px] border-green-400"}`}
                        >
                            <img
                                src={item.thumbnail}
                                alt=""
                                width={200}
                                height={200}
                                className="h-40"
                            />
                            <div className="text-4xl text-slate-700 text-center py-4 font-bold">{item.package_name}</div>
                            <p className="lg:text-sm text-xs text-center px-6 text-slate-500">
                                {item.package_description}
                            </p>
                            <div className="text-4xl text-center font-bold py-4">
                                ${item.package_price}
                            </div>
                            <div className="mx-auto flex justify-center items-center my-3">
                                {
                                    planType === item.id ? (
                                        <button
                                            className="bg-green-600 text-white rounded-md text-base uppercase w-24 py-2 font-bold"
                                        >
                                            Subscribed
                                        </button>
                                    ) : (
                                        <button
                                            onClick={e => payment(e, item.id)}
                                            className="bg-[#3d5fc4] text-white rounded-md text-base uppercase w-24 py-2 font-bold"
                                        >
                                            Purchase
                                        </button>
                                    )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mx-auto max-w-screen-xl h-full w-full">
                    <PaymentHistoryTable/>
                </div>
            </main>
        </div>

    )
};

export default SubscriptionPage;

// <div className="flex flex-col items-center w-full mx-auto min-h-screen diagonal-background overflow-x-hidden">
//     <div className="flex justify-between items-center w-full px-6 h-20 bg-[#00000012]">
//         <div className="text-4xl font-bold text-black">Subscription Plan</div>
//         {/*<div className="flex justify-center items-center gap-2">*/}
//         {/*    {!userId ? (*/}
//         {/*        <a href="/login"*/}
//         {/*        className="bg-white px-4 py-2 uppercase w-auto rounded-lg text-xl text-[#4f7cff] font-semibold">*/}
//         {/*            Login*/}
//         {/*        </a>*/}
//         {/*    ) : (*/}
//         {/*        <div className="flex justify-center items-center space-x-4">*/}
//         {/*            <span className="text-white text-xl">{userName}</span>*/}
//         {/*            <button onClick={() => firebase.auth().signOut()}*/}
//         {/*            className="bg-white px-4 py-2 w-auto rounded-lg text-base uppercase font-semibold text-[#4f7cff]"*/}
//         {/*            >*/}
//         {/*                Log Out*/}
//         {/*            </button>*/}
//         {/*        </div>*/}
//         {/*    )}*/}
//         {/*</div>*/}
//     </div>
//
//
// </div>